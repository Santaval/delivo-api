import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export interface AddMemberByCodeRequest {
  code: string;
  role: Exclude<CompanyRoleType, "OWNER">;
}
