import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";

export interface MemberResponse {
  userId: string;
  name: string;
  surnames: string;
  email: string;
  role: CompanyRoleType;
}