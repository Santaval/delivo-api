import { PaymentProviderType } from "@/domain/billing/valueObjects/paymentProvider.valueObject";

/**
 * Convention: `app_user_id` (RevenueCat's term for the provider customer id) MUST be the
 * `companyId`. The mobile client passes the organization id as the RevenueCat app user id when
 * starting a purchase, because credits belong to a `Company`, not to an individual user. For
 * consumable credit packs this has no transfer problem: a grant is written to our ledger once,
 * keyed by the store transaction id, so nothing the provider does later (restore, transfer,
 * alias) can move it. Every adapter implementing this port must uphold the same convention so
 * `CreditEvent.companyId` can always be trusted.
 */

/** Provider-neutral meaning of a billing event. */
export type CreditEventKind =
  | "PURCHASE" // a consumable credit pack was bought
  | "REFUND"; // the store refunded a purchase

export type CreditEnvironment = "SANDBOX" | "PRODUCTION";

export interface CreditEvent {
  /** Provider event id, for logging diagnostics. */
  eventId: string;
  kind: CreditEventKind;
  /** By convention this IS the provider's app user id (see above). */
  companyId: string;
  /** Store transaction id of the purchase; the idempotency key of the grant. */
  transactionId: string;
  productId: string;
  environment: CreditEnvironment | null;
  occurredAt: Date;
}

/**
 * Provider-agnostic port for payment providers. RevenueCat is the first adapter
 * (`src/infrastructure/billing/providers/RevenueCatProvider.ts`); Tilopay can implement this
 * same contract later without touching application-layer code.
 */
export interface IPaymentProvider {
  readonly name: PaymentProviderType;
  /** True when the request genuinely came from the provider. */
  verifyWebhook(headers: Record<string, string | string[] | undefined>): boolean;
  /** Provider payload -> neutral event, or null when the event type is not relevant to us. */
  parseWebhookEvent(payload: unknown): CreditEvent | null;
  /**
   * Best-effort: delete the subscriber on the provider side. By convention
   * `providerCustomerId === companyId` (see above).
   *
   * Idempotent: calling it for an already-deleted (or never-existing) subscriber
   * resolves successfully. Implementations MUST silently skip (log + return) when
   * the provider credentials are not configured, so account deletion still succeeds
   * on a deployment without them. Throws InfrastructureError on transient failure;
   * the caller is expected to catch and log, never to revert the DB deletion.
   */
  deleteSubscriber(providerCustomerId: string): Promise<void>;
}
