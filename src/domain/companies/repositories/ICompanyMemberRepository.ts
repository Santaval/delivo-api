import { CompanyMember } from "@/domain/companies/entities/CompanyMember";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export interface ICompanyMemberRepository {
  findByCompany(companyId: string): Promise<CompanyMember[]>;
  findMembership(userId: string, companyId: string): Promise<CompanyMember | null>;
  add(member: CompanyMember): Promise<void>;
  updateRole(member: CompanyMember): Promise<void>;
  remove(userId: string, companyId: string): Promise<void>;
  /**
   * Count company members holding a specific role.
   * @param companyId The ID of the company.
   * @param role The company role to filter by.
   * @returns A promise that resolves to the number of matching members.
   */
  countByCompanyAndRole(companyId: string, role: CompanyRoleType): Promise<number>;
}
