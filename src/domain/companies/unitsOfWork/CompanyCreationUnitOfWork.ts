import { ICreditRepository } from "@/domain/credits/repositories/ICreditRepository";
import { ICompanyRepository } from "../repositories/ICompanyRepository";

/**
 * Creating an organization must also add its owner membership and grant its welcome
 * credits. All of it happens in one transaction so a company can never exist without a
 * credit balance.
 */
export interface ICompanyCreationUnitOfWork {
  runInTransaction<T>(work: (context: ICompanyCreationContext) => Promise<T>): Promise<T>;
}

export interface ICompanyCreationContext {
  getCompanyRepository(): ICompanyRepository;
  getCreditRepository(): ICreditRepository;
}
