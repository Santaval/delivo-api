/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from "@/domain/products/entities/Product";
import { Product as PrismaProduct } from "@/infrastructure/prisma/generated/prisma/client";
import { ProductCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export class PrismaProductMapper {
  static toDomain(row: PrismaProduct): Product {
    return new Product({
      id: row.id,
      name: row.name,
      ivaRate: row.ivaRate.toString(),
      grossPrice: row.grossPrice.toString(),
      companyId: row.companyId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      deletedAt: row.deletedAt?.toISOString() ?? null,
    });
  }

  static toPersistence(product: Product): ProductCreateArgs {
    return {
      data: {
        name: product.name,
        ivaRate: product.pricing.ivaRate,
        grossPrice: product.pricing.grossPrice,
        companyId: product.companyId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        deletedAt: product.deletedAt,
      },
    };
  }
}
