import {
  IBillIssuingContext,
  IBillIssuingUnitOfWork,
} from "@/domain/orders/unitsOfWork/BillIssuingUnitOfWork";
import { prisma } from "@/infrastructure/prisma/client";
import PrismaOrdersRepository from "../repositories/PrismaOrdersRepository";
import PrismaCreditRepository from "@/infrastructure/credits/repositories/PrismaCreditRepository";

export class PrismaBillIssuingUnitOfWork implements IBillIssuingUnitOfWork {
  async runInTransaction<T>(work: (context: IBillIssuingContext) => Promise<T>): Promise<T> {
    return await prisma.$transaction(
      async (tx) => {
        const context: IBillIssuingContext = {
          getOrderRepository: () => new PrismaOrdersRepository(tx),
          getCreditRepository: () => new PrismaCreditRepository(tx),
        };

        return await work(context);
      },
      { timeout: 10000 },
    );
  }
}
