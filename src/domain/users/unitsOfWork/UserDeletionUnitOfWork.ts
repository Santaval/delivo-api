import { IUserRepository } from "@/domain/users/repositories/IUserRepository";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { ICompanyMemberRepository } from "@/domain/companies/repositories/ICompanyMemberRepository";
import { ICompanyInvitationRepository } from "@/domain/companies/repositories/ICompanyInvitationRepository";

/**
 * Deleting a user that owns a single company means deleting the whole company
 * graph (RESTRICT on every FK) plus the user itself, atomically. The caller
 * decides which companies of the user to tear down; this unit of work only
 * guarantees that every deletion runs in one transaction so a failure midway
 * leaves the database intact.
 *
 * @see src/infrastructure/users/unitsOfWork/PrismaUserDeletionUnitOfWork.ts
 */
export interface IUserDeletionUnitOfWork {
  runInTransaction<T>(work: (context: IUserDeletionContext) => Promise<T>): Promise<T>;
}

export interface IUserDeletionContext {
  getUserRepository(): IUserRepository;
  getCompanyRepository(): ICompanyRepository;
  getCompanyMemberRepository(): ICompanyMemberRepository;
  getCompanyInvitationRepository(): ICompanyInvitationRepository;
}