import { CompanyInvitation } from "@/domain/companies/entities/CompanyInvitation";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export interface CompanyMemberDetails {
  userId: string;
  name: string;
  surnames: string;
  email: string;
  role: CompanyRoleType;
}

export interface ICompanyMemberService {
  inviteMember(companyId: string, actingUserId: string, email: string, role: CompanyRoleType): Promise<CompanyInvitation>;
  listMembers(companyId: string, actingUserId: string): Promise<CompanyMemberDetails[]>;
  listInvitations(companyId: string, actingUserId: string): Promise<CompanyInvitation[]>;
  acceptInvitation(token: string, acceptingUserId: string, acceptingEmail: string): Promise<void>;
  revokeInvitation(invitationId: string, actingUserId: string): Promise<void>;
  removeMember(companyId: string, actingUserId: string, targetUserId: string): Promise<void>;
}