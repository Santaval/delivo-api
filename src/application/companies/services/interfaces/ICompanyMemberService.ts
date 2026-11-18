import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export interface CompanyMemberDetails {
  userId: string;
  name: string;
  surnames: string;
  email: string;
  role: CompanyRoleType;
}

export interface ICompanyMemberService {
  addMemberByCode(companyId: string, actingUserId: string, code: string, role: CompanyRoleType): Promise<CompanyMemberDetails>;
  listMembers(companyId: string, actingUserId: string): Promise<CompanyMemberDetails[]>;
  removeMember(companyId: string, actingUserId: string, targetUserId: string): Promise<void>;
  leaveCompany(companyId: string, userId: string): Promise<void>;
}