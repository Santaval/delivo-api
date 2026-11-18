import { Request, Response } from "express";
import { ICompanyMemberService } from "@/application/companies/services/interfaces/ICompanyMemberService";
import { MemberResponse } from "../responses/MemberResponse";
import { AddMemberByCodeRequest } from "../requests/AddMemberByCodeRequest";

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

  async addMemberByCode(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const actingUserId = req.user.id;
    const { code, role } = req.body as AddMemberByCodeRequest;
    // validateSchema only validates (it does not replace req.body), so normalize here too.
    const normalizedCode = code.replace(/\s+/g, "");
    const d = await this.companyMemberService.addMemberByCode(companyId, actingUserId, normalizedCode, role);
    const response: MemberResponse = {
      userId: d.userId,
      name: d.name,
      surnames: d.surnames,
      email: d.email,
      role: d.role,
    };
    res.status(201).json(response);
  }

  async leaveCompany(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    const userId = req.user.id;
    await this.companyMemberService.leaveCompany(companyId, userId);
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