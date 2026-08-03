import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";
import { InvitationStatusType } from "@/domain/companies/valueObjects/invitationStatus.valueObject";

export interface InvitationResponse {
  id: string;
  email: string;
  role: CompanyRoleType;
  status: InvitationStatusType;
  expiresAt: string;
  createdAt: string;
}