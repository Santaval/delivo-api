/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ICompanyCreationContext,
  ICompanyCreationUnitOfWork,
} from "@/domain/companies/unitsOfWork/CompanyCreationUnitOfWork";
import { prisma } from "@/infrastructure/prisma/client";
import PrismaCompaniesRepository from "../repositories/PrismaCompaniesRepository";
import PrismaSubscriptionRepository from "@/infrastructure/billing/repositories/PrismaSubscriptionRepository";

export class PrismaCompanyCreationUnitOfWork implements ICompanyCreationUnitOfWork {
  private readonly prisma = prisma;

  async runInTransaction<T>(work: (context: ICompanyCreationContext) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (tx: any) => {

      const context: ICompanyCreationContext = {
        getCompanyRepository: () => new PrismaCompaniesRepository(tx),
        getSubscriptionRepository: () => new PrismaSubscriptionRepository(tx),
      };

      return await work(context);
    });
  }
}
