import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export interface InviteMemberRequest {
  email: string;
  role: Exclude<CompanyRoleType, "OWNER">;
}