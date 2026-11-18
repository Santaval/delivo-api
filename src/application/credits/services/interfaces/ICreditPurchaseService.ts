import { CreditEvent } from "@/domain/billing/providers/IPaymentProvider";

export type CreditEventOutcome = "APPLIED" | "DUPLICATE" | "UNKNOWN_PRODUCT" | "UNKNOWN_COMPANY";

export interface ICreditPurchaseService {
  /**
   * Applies a provider purchase/refund event to the company's credit ledger. Idempotent: an
   * event whose store transaction was already recorded resolves to DUPLICATE and changes nothing.
   */
  applyEvent(event: CreditEvent): Promise<CreditEventOutcome>;
}
