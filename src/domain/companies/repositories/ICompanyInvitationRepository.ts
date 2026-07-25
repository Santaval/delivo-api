import { CompanyInvitation } from "@/domain/companies/entities/CompanyInvitation";

export interface ICompanyInvitationRepository {
  create(invitation: CompanyInvitation): Promise<void>;
  findByToken(token: string): Promise<CompanyInvitation | null>;
  findPendingByEmailAndCompany(email: string, companyId: string): Promise<CompanyInvitation | null>;
  findByCompany(companyId: string): Promise<CompanyInvitation[]>;
  update(invitation: CompanyInvitation): Promise<void>;
}
