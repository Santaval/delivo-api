import { PaymentProviderType } from "@/domain/billing/valueObjects/paymentProvider.valueObject";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";

/**
 * Convention: `app_user_id` (RevenueCat's term for the provider customer id) MUST be the
 * `companyId`. The mobile client passes the organization id as the RevenueCat app user id when
 * starting a purchase, because plans belong to a `Company`, not to an individual user. Every
 * adapter implementing this port must uphold that same convention so `providerCustomerId` below
 * can always be trusted to equal `companyId`.
 */

/** Provider-neutral meaning of a billing event. */
export type SubscriptionEventKind =
  | "ACTIVATED" // purchase, renewal, product change, uncancellation
  | "CANCELLED" // auto-renew off; access continues until periodEnd
  | "EXPIRED" // access ended -> effective tier falls back to FREE
  | "BILLING_ISSUE"; // payment failed -> grace period

export interface SubscriptionEvent {
  /** Provider event id, for logging/idempotency diagnostics. */
  eventId: string;
  kind: SubscriptionEventKind;
  provider: PaymentProviderType;
  /** Provider customer id. By convention this IS the companyId (see above). */
  providerCustomerId: string;
  companyId: string;
  tier: PlanTierType;
  entitlementId: string | null;
  periodStart: Date | null;
  periodEnd: Date | null;
}

/**
 * Provider-agnostic port for payment/subscription providers. RevenueCat is the first adapter
 * (`src/infrastructure/billing/providers/RevenueCatProvider.ts`); Tilopay can implement this
 * same contract later without touching application-layer code.
 */
export interface IPaymentProvider {
  readonly name: PaymentProviderType;
  /** True when the request genuinely came from the provider. */
  verifyWebhook(headers: Record<string, string | string[] | undefined>): boolean;
  /** Provider payload -> neutral event, or null when the event type is not relevant to us. */
  parseWebhookEvent(payload: unknown): SubscriptionEvent | null;
}
