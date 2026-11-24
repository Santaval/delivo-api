import { CompanyMember } from "@/domain/companies/entities/CompanyMember";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";
import { ICompanyMemberRepository } from "@/domain/companies/repositories/ICompanyMemberRepository";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import IRouteRepository from "@/domain/routes/repositories/IRouteRepository";
import { IUserRepository } from "@/domain/users/repositories/IUserRepository";
import { ICompanyMemberService, CompanyMemberDetails } from "../interfaces/ICompanyMemberService";
import MemberAddedEmailSender from "../members/MemberAddedEmailSender";
import { CompanyNotFoundError } from "../../errors/CompanyNotFoundError";
import { NotAllowedToManageMembersError } from "../../errors/NotAllowedToManageMembersError";
import { AlreadyMemberError } from "../../errors/AlreadyMemberError";
import { CannotRemoveLastOwnerError } from "../../errors/CannotRemoveLastOwnerError";
import { MemberNotFoundError } from "../../errors/MemberNotFoundError";
import { MemberCodeNotFoundError } from "../../errors/MemberCodeNotFoundError";

export class CompanyMemberService implements ICompanyMemberService {
  constructor(
    private readonly memberRepository: ICompanyMemberRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly userRepository: IUserRepository,
    private readonly memberAddedEmailSender: MemberAddedEmailSender,
    private readonly routeRepository: IRouteRepository,
  ) {}

  async addMemberByCode(
    companyId: string,
    actingUserId: string,
    code: string,
    role: CompanyRoleType,
  ): Promise<CompanyMemberDetails> {
    const actingMember = await this.memberRepository.findMembership(actingUserId, companyId);
    if (!actingMember?.canManageMembers()) {
      throw new NotAllowedToManageMembersError();
    }

    if (role === "OWNER") {
      throw new NotAllowedToManageMembersError("Cannot add a member as OWNER");
    }

    const company = await this.companyRepository.find(companyId, "id");
    if (!company) throw new CompanyNotFoundError();

    const targetUser = await this.userRepository.findByMemberCode(code);
    if (!targetUser) {
      // Never log the code itself: it is a credential-like handle.
      console.warn(`Member code lookup failed (actingUserId=${actingUserId}, companyId=${companyId})`);
      throw new MemberCodeNotFoundError();
    }

    const existingMembership = await this.memberRepository.findMembership(targetUser.id, companyId);
    if (existingMembership) throw new AlreadyMemberError();

    await this.memberRepository.add(
      new CompanyMember({ userId: targetUser.id, companyId, role }),
    );

    try {
      const adder = await this.userRepository.find(actingUserId, "id");
      const adderName = adder ? `${adder.name} ${adder.surnames}`.trim() : "Un administrador";
      await this.memberAddedEmailSender.sendMemberAddedEmail(targetUser.email.value, adderName, company.name);
    } catch (error) {
      console.error("Failed to send member added email:", error);
    }

    return {
      userId: targetUser.id,
      name: targetUser.name,
      surnames: targetUser.surnames,
      email: targetUser.email.value,
      role,
    };
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

    await this.routeRepository.unassignDriverInCompany(targetUserId, companyId);
    await this.memberRepository.remove(targetUserId, companyId);
  }

  async leaveCompany(companyId: string, userId: string): Promise<void> {
    const member = await this.memberRepository.findMembership(userId, companyId);
    if (!member) throw new MemberNotFoundError();

    const allMembers = await this.memberRepository.findByCompany(companyId);
    if (CompanyMember.isLastOwner(member, allMembers)) {
      throw new CannotRemoveLastOwnerError();
    }

    await this.routeRepository.unassignDriverInCompany(userId, companyId);
    await this.memberRepository.remove(userId, companyId);
  }
}
