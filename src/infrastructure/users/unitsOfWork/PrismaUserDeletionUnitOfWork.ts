/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  IUserDeletionContext,
  IUserDeletionUnitOfWork,
} from "@/domain/users/unitsOfWork/UserDeletionUnitOfWork";
import { prisma } from "@/infrastructure/prisma/client";
import PrismaUsersRepository from "@/infrastructure/users/repositories/PrismaUsersRepository";
import PrismaCompaniesRepository from "@/infrastructure/companies/repositories/PrismaCompaniesRepository";
import PrismaCompanyMemberRepository from "@/infrastructure/companies/repositories/PrismaCompanyMemberRepository";
import PrismaCompanyInvitationRepository from "@/infrastructure/companies/repositories/PrismaCompanyInvitationRepository";

export class PrismaUserDeletionUnitOfWork implements IUserDeletionUnitOfWork {
  private readonly prisma = prisma;

  async runInTransaction<T>(work: (context: IUserDeletionContext) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async (tx: any) => {

      const context: IUserDeletionContext = {
        getUserRepository: () => new PrismaUsersRepository(tx),
        getCompanyRepository: () => new PrismaCompaniesRepository(tx),
        getCompanyMemberRepository: () => new PrismaCompanyMemberRepository(tx),
        getCompanyInvitationRepository: () => new PrismaCompanyInvitationRepository(tx),
      };

      return await work(context);
    });
  }
}