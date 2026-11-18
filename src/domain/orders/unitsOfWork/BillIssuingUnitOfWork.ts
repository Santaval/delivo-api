import IOrderRepository from "../repositories/IOrderRepository";
import { ICreditRepository } from "@/domain/credits/repositories/ICreditRepository";

/**
 * Issuing a bill costs one credit. The credit debit, the bill and the ledger row commit
 * together or not at all, so two concurrent requests can never both pass a stale balance
 * check, and a bill that fails to be created never charges the company.
 *
 * TODO(PBI-007): when bill cancellation exists, a cancelled bill should add a +1 REFUND-style
 * entry (billId-keyed) in its own unit of work.
 */
export interface IBillIssuingUnitOfWork {
  runInTransaction<T>(work: (context: IBillIssuingContext) => Promise<T>): Promise<T>;
}

export interface IBillIssuingContext {
  getOrderRepository(): IOrderRepository;
  getCreditRepository(): ICreditRepository;
}
