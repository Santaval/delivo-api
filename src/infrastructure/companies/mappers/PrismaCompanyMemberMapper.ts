import { CompanyMember } from "@/domain/companies/entities/CompanyMember";
import { CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";
import { UserCompany as PrismaUserCompany } from "@/infrastructure/prisma/generated/prisma/client";

export class PrismaCompanyMemberMapper {
  static toDomain(row: PrismaUserCompany): CompanyMember {
    return new CompanyMember({
      userId: row.userId,
      companyId: row.companyId,
      role: row.role as CompanyRoleType,
    });
  }

  static toPersistence(member: CompanyMember) {
    return {
      data: {
        userId: member.userId,
        companyId: member.companyId,
        role: member.role,
      },
    };
  }
}