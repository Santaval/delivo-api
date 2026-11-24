import { CreditEvent } from "@/domain/billing/providers/IPaymentProvider";

export type CreditEventOutcome = "APPLIED" | "DUPLICATE" | "UNKNOWN_PRODUCT" | "UNKNOWN_COMPANY" | "SANDBOX_IGNORED";

export interface ICreditPurchaseService {
  /**
   * Applies a provider purchase/refund event to the company's credit ledger. Idempotent: an
   * event whose store transaction was already recorded resolves to DUPLICATE and changes nothing. A refund is booked on the company of the original purchase. Sandbox events
   * resolve to SANDBOX_IGNORED unless the deployment accepts them.
   */
  applyEvent(event: CreditEvent): Promise<CreditEventOutcome>;
}
