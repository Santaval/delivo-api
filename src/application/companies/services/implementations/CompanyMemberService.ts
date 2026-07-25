import { CompanyInvitation } from "@/domain/companies/entities/CompanyInvitation";
import { CompanyMember } from "@/domain/companies/entities/CompanyMember";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";
import { ICompanyInvitationRepository } from "@/domain/companies/repositories/ICompanyInvitationRepository";
import { ICompanyMemberRepository } from "@/domain/companies/repositories/ICompanyMemberRepository";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { IUserRepository } from "@/domain/users/repositories/IUserRepository";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";
import { ICompanyMemberService, CompanyMemberDetails } from "../interfaces/ICompanyMemberService";
import InvitationEmailSender from "../invitations/InvitationEmailSender";
import { CompanyNotFoundError } from "../../errors/CompanyNotFoundError";
import { NotAllowedToManageMembersError } from "../../errors/NotAllowedToManageMembersError";
import { InvitationNotFoundError } from "../../errors/InvitationNotFoundError";
import { InvitationExpiredError } from "../../errors/InvitationExpiredError";
import { AlreadyMemberError } from "../../errors/AlreadyMemberError";
import { InvitationAlreadyExistsError } from "../../errors/InvitationAlreadyExistsError";
import { CannotRemoveLastOwnerError } from "../../errors/CannotRemoveLastOwnerError";
import { MemberNotFoundError } from "../../errors/MemberNotFoundError";

const INVITATION_EXPIRY_DAYS = 7;

export class CompanyMemberService implements ICompanyMemberService {
  constructor(
    private readonly memberRepository: ICompanyMemberRepository,
    private readonly invitationRepository: ICompanyInvitationRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly userRepository: IUserRepository,
    private readonly idGenerator: IIDGenerator,
    private readonly invitationEmailSender: InvitationEmailSender,
  ) {}

  async inviteMember(
    companyId: string,
    actingUserId: string,
    email: string,
    role: CompanyRoleType,
  ): Promise<CompanyInvitation> {
    const normalizedEmail = email.toLowerCase().trim();

    const actingMember = await this.memberRepository.findMembership(actingUserId, companyId);
    if (!actingMember?.canManageMembers()) {
      throw new NotAllowedToManageMembersError();
    }

    if (role === "OWNER") {
      throw new NotAllowedToManageMembersError("Cannot invite a member as OWNER");
    }

    const company = await this.companyRepository.find(companyId, "id");
    if (!company) throw new CompanyNotFoundError();

    const existingUser = await this.userRepository.find(normalizedEmail, "email");
    if (existingUser) {
      const existingMembership = await this.memberRepository.findMembership(existingUser.id, companyId);
      if (existingMembership) throw new AlreadyMemberError();
    }

    const pendingInvitation = await this.invitationRepository.findPendingByEmailAndCompany(normalizedEmail, companyId);
    if (pendingInvitation) throw new InvitationAlreadyExistsError();

    const inviterUser = await this.userRepository.find(actingUserId, "id");
    const inviterName = inviterUser
      ? `${inviterUser.name} ${inviterUser.surnames}`.trim()
      : "Un administrador";

    const now = new Date();
    const expiresAt = new Date(now.getTime() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const invitation = new CompanyInvitation({
      id: this.idGenerator.generate(),
      email: normalizedEmail,
      role,
      status: "PENDING",
      token: this.idGenerator.generate(),
      expiresAt: expiresAt.toISOString(),
      companyId,
      invitedById: actingUserId,
    });

    await this.invitationRepository.create(invitation);

    try {
      await this.invitationEmailSender.sendInvitationEmail(invitation, company.name, inviterName);
    } catch (error) {
      console.error("Failed to send invitation email:", error);
    }

    return invitation;
  }

  async listMembers(companyId: string, actingUserId: string): Promise<CompanyMemberDetails[]> {
    const actingMember = await this.memberRepository.findMembership(actingUserId, companyId);
    if (!actingMember) throw new NotAllowedToManageMembersError();

    const members = await this.memberRepository.findByCompany(companyId);

    const details: CompanyMemberDetails[] = [];
    for (const member of members) {
      const user = await this.userRepository.find(member.userId, "id");
      details.push({
        userId: member.userId,
        name: user?.name ?? "",
        surnames: user?.surnames ?? "",
        email: user?.email.value ?? "",
        role: member.role,
      });
    }

    return details;
  }

  async listInvitations(companyId: string, actingUserId: string): Promise<CompanyInvitation[]> {
    const actingMember = await this.memberRepository.findMembership(actingUserId, companyId);
    if (!actingMember?.canManageMembers()) throw new NotAllowedToManageMembersError();

    const invitations = await this.invitationRepository.findByCompany(companyId);
    return invitations.filter((invitation) => invitation.isPending());
  }

  async acceptInvitation(token: string, acceptingUserId: string, acceptingEmail: string): Promise<void> {
    const invitation = await this.invitationRepository.findByToken(token);
    if (!invitation) throw new InvitationNotFoundError();

    const normalizedAcceptingEmail = acceptingEmail.toLowerCase().trim();
    if (invitation.email !== normalizedAcceptingEmail) {
      throw new NotAllowedToManageMembersError("This invitation was sent to a different email");
    }

    if (!invitation.isPending()) {
      throw new InvitationNotFoundError("Invitation is no longer valid");
    }

    if (invitation.isExpired()) throw new InvitationExpiredError();

    const existingMembership = await this.memberRepository.findMembership(acceptingUserId, invitation.companyId);
    if (existingMembership) throw new AlreadyMemberError();

    const member = new CompanyMember({
      userId: acceptingUserId,
      companyId: invitation.companyId,
      role: invitation.role,
    });
    await this.memberRepository.add(member);

    invitation.accept();
    await this.invitationRepository.update(invitation);
  }

  async revokeInvitation(invitationId: string, actingUserId: string): Promise<void> {
    const invitation = await this.invitationRepository.findById(invitationId);
    if (!invitation) throw new InvitationNotFoundError();

    const actingMember = await this.memberRepository.findMembership(actingUserId, invitation.companyId);
    if (!actingMember?.canManageMembers()) throw new NotAllowedToManageMembersError();

    if (!invitation.isPending()) {
      throw new InvitationNotFoundError("Only pending invitations can be revoked");
    }

    invitation.revoke();
    await this.invitationRepository.update(invitation);
  }

  async removeMember(companyId: string, actingUserId: string, targetUserId: string): Promise<void> {
    const actingMember = await this.memberRepository.findMembership(actingUserId, companyId);
    if (!actingMember?.canManageMembers()) throw new NotAllowedToManageMembersError();

    const targetMember = await this.memberRepository.findMembership(targetUserId, companyId);
    if (!targetMember) throw new MemberNotFoundError();

    if (!actingMember.canRemove(targetMember)) {
      throw new NotAllowedToManageMembersError("An admin cannot remove an owner");
    }

    const allMembers = await this.memberRepository.findByCompany(companyId);
    if (CompanyMember.isLastOwner(targetMember, allMembers)) {
      throw new CannotRemoveLastOwnerError();
    }

    await this.memberRepository.remove(targetUserId, companyId);
  }
}