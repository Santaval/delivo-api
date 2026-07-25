import { CompanyInvitation } from "@/domain/companies/entities/CompanyInvitation";
import { InvitationStatusType } from "@/domain/companies/valueObjects/invitationStatus.valueObject";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";
import { CompanyInvitation as PrismaCompanyInvitation } from "@/infrastructure/prisma/generated/prisma/client";

export class PrismaCompanyInvitationMapper {
  static toDomain(row: PrismaCompanyInvitation): CompanyInvitation {
    return new CompanyInvitation({
      id: row.id,
      email: row.email,
      role: row.role as CompanyRoleType,
      status: row.status as InvitationStatusType,
      token: row.token,
      expiresAt: row.expiresAt.toISOString(),
      companyId: row.companyId,
      invitedById: row.invitedById,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  static toPersistence(invitation: CompanyInvitation) {
    return {
      data: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        token: invitation.token,
        expiresAt: invitation.expiresAt,
        companyId: invitation.companyId,
        invitedById: invitation.invitedById,
      },
    };
  }
}