/* eslint-disable @typescript-eslint/no-explicit-any */

import { Company } from "@/domain/companies/entities/Company";
import { Company as PrismaCompany } from "@/infrastructure/prisma/generated/prisma/client";
import { CompanyCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export class PrismaCompanyMapper {
  static toDomain(row: PrismaCompany): Company {
    console.log(row)
    return new Company({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  static toPersistence(company: Company): CompanyCreateArgs {
    return {
      data: {
        id: company.id,
        name: company.name,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    };
  }
}
