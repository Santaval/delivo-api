import { Request, Response } from "express";
import { ICompanyMemberService } from "@/application/companies/services/interfaces/ICompanyMemberService";
import { MemberResponse } from "../responses/MemberResponse";
import { InvitationResponse } from "../responses/InvitationResponse";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export default class CompanyMemberController {
  constructor(private readonly companyMemberService: ICompanyMemberService) {}

  async listMembers(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const userId = req.user.id;
    const details = await this.companyMemberService.listMembers(companyId, userId);
    const response: MemberResponse[] = details.map((d) => ({
      userId: d.userId,
      name: d.name,
      surnames: d.surnames,
      email: d.email,
      role: d.role,
    }));
    res.json(response);
  }

  async listInvitations(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const userId = req.user.id;
    const invitations = await this.companyMemberService.listInvitations(companyId, userId);
    const response: InvitationResponse[] = invitations.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      status: i.status,
      expiresAt: i.expiresAt.toISOString(),
      createdAt: i.createdAt.toISOString(),
    }));
    res.json(response);
  }

  async inviteMember(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const actingUserId = req.user.id;
    const { email, role } = req.body as { email: string; role: Exclude<CompanyRoleType, "OWNER"> };
    const invitation = await this.companyMemberService.inviteMember(companyId, actingUserId, email, role);
    const response: InvitationResponse = {
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      status: invitation.status,
      expiresAt: invitation.expiresAt.toISOString(),
      createdAt: invitation.createdAt.toISOString(),
    };
    res.status(201).json(response);
  }

  async revokeInvitation(req: Request, res: Response): Promise<void> {
    const { invitationId } = req.params;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const actingUserId = req.user.id;
    await this.companyMemberService.revokeInvitation(invitationId, actingUserId);
    res.status(204).send();
  }

  async acceptInvitation(req: Request, res: Response): Promise<void> {
    const { token } = req.body as { token: string };
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const { id: acceptingUserId, email: acceptingEmail } = req.user;
    await this.companyMemberService.acceptInvitation(token, acceptingUserId, acceptingEmail);
    res.status(204).send();
  }

  async removeMember(req: Request, res: Response): Promise<void> {
    const { companyId, userId } = req.params;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const actingUserId = req.user.id;
    await this.companyMemberService.removeMember(companyId, actingUserId, userId);
    res.status(204).send();
  }
}