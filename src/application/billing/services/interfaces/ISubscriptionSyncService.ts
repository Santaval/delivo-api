import { SubscriptionEvent } from "@/domain/billing/providers/IPaymentProvider";

export interface ISubscriptionSyncService {
  /** Applies a provider event to the company's subscription. Idempotent. */
  applyEvent(event: SubscriptionEvent): Promise<void>;
}
