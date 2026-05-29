// infrastructure/database/PrismaProductDeletionUnitOfWork.ts

import { IProductDeletionContext, IProductDeletionUnitOfWork } from "@/domain/products/unitsOfWork/ProductDeletionUnitOfWork";
import { IProductRepository } from "@/domain/products/repositories/IProductRepository";
import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { ordersRepository, productsRepository } from "@/dependencyInjection/container";
import PrismaProductsRepository from "../repositories/PrismaProductsRepository";
import PrismaOrderRepository from "@/infrastructure/orders/repositories/PrismaOrdersRepository";



export class PrismaProductDeletionUnitOfWork implements IProductDeletionUnitOfWork {
  private readonly prisma = prisma;
  async runInTransaction<T>(work: (context: IProductDeletionContext) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (tx: any) => {

      const context: IProductDeletionContext = {
        getProductRepository: () => new PrismaProductsRepository(tx),
        getOrderRepository: () => new PrismaOrderRepository(tx)
      };

      return await work(context);
    });
  }
}