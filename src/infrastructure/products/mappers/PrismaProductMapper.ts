/* eslint-disable @typescript-eslint/no-explicit-any */

import { Product } from "@/domain/products/entities/Product";
import { Product as PrismaProduct } from "@/infrastructure/prisma/generated/prisma/client";
import { ProductCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export class PrismaProductMapper {
  static toDomain(row: PrismaProduct): Product {
    return new Product({
      id: row.id,
      name: row.name,
      netPrice: row.netPrice.toString(),
      ivaRate: row.ivaRate.toString(),
      companyId: row.companyId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  static toPersistence(product: Product): ProductCreateArgs {
    return {
      data: {
        id: product.id,
        name: product.name,
        netPrice: product.netPrice,
        ivaRate: product.ivaRate,
        companyId: product.companyId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    };
  }
}
