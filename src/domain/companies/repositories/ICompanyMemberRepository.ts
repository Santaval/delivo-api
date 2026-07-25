import { CompanyMember } from "@/domain/companies/entities/CompanyMember";

export interface ICompanyMemberRepository {
  findByCompany(companyId: string): Promise<CompanyMember[]>;
  findMembership(userId: string, companyId: string): Promise<CompanyMember | null>;
  add(member: CompanyMember): Promise<void>;
  updateRole(member: CompanyMember): Promise<void>;
  remove(userId: string, companyId: string): Promise<void>;
}
