import { ISubscriptionRepository } from "@/domain/billing/repositories/ISubscriptionRepository";
import { ICompanyRepository } from "../repositories/ICompanyRepository";

/**
 * Creating an organization must also create its default FREE subscription and its owner
 * membership. All three happen in one transaction so a company can never exist without a
 * plan (which the entitlement layer would otherwise have to keep guessing about).
 */
export interface ICompanyCreationUnitOfWork {
  runInTransaction<T>(work: (context: ICompanyCreationContext) => Promise<T>): Promise<T>;
}

export interface ICompanyCreationContext {
  getCompanyRepository(): ICompanyRepository;
  getSubscriptionRepository(): ISubscriptionRepository;
}
