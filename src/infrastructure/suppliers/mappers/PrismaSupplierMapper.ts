/* eslint-disable @typescript-eslint/no-explicit-any */

import { Supplier } from "@/domain/suppliers/entities/Supplier";
import { Supplier as PrismaSupplier } from "@/infrastructure/prisma/generated/prisma/client";
import { SupplierCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export class PrismaSupplierMapper {
  static toDomain(row: PrismaSupplier): Supplier {
    return new Supplier({
      id: row.id,
      name: row.name,
      companyId: row.companyId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  static toPersistence(supplier: Supplier): SupplierCreateArgs {
    return {
      data: {
        id: supplier.id,
        name: supplier.name,
        companyId: supplier.companyId,
        createdAt: supplier.createdAt,
        updatedAt: supplier.updatedAt,
      },
    };
  }
}
