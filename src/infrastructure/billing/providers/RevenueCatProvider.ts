import crypto from "crypto";
import { IPaymentProvider, SubscriptionEvent, SubscriptionEventKind } from "@/domain/billing/providers/IPaymentProvider";
import { PaymentProviderType } from "@/domain/billing/valueObjects/paymentProvider.valueObject";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";

/** RevenueCat event types that map to a neutral kind. Anything else is ignored (return null). */
const EVENT_KIND_BY_TYPE: Record<string, SubscriptionEventKind> = {
  INITIAL_PURCHASE: "ACTIVATED",
  RENEWAL: "ACTIVATED",
  PRODUCT_CHANGE: "ACTIVATED",
  UNCANCELLATION: "ACTIVATED",
  CANCELLATION: "CANCELLED",
  EXPIRATION: "EXPIRED",
  BILLING_ISSUE: "BILLING_ISSUE",
};

interface RevenueCatWebhookEvent {
  id?: string;
  type?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  entitlement_ids?: string[];
  entitlement_id?: string;
  purchased_at_ms?: number;
  expiration_at_ms?: number;
}

interface RevenueCatWebhookPayload {
  api_version?: string;
  event?: RevenueCatWebhookEvent;
}

/**
 * Infrastructure adapter for RevenueCat, implementing the provider-agnostic `IPaymentProvider`
 * port. Only handles webhook verification and payload parsing; persistence lives in
 * `SubscriptionSyncService`.
 */
export default class RevenueCatProvider implements IPaymentProvider {
  readonly name: PaymentProviderType = "REVENUECAT";

  private hasWarnedAboutMissingSecret = false;

  constructor(private readonly webhookAuth: string) {}

  /**
   * Compares the `Authorization` header against the configured `REVENUECAT_WEBHOOK_AUTH` secret.
   * RevenueCat sends back verbatim whatever string is configured in its dashboard, so the header
   * is accepted both as-is and with a `Bearer ` prefix stripped.
   *
   * Fails closed: if the secret is not configured (empty string), no header can ever verify —
   * an unconfigured deployment must not accept webhooks.
   */
  verifyWebhook(headers: Record<string, string | string[] | undefined>): boolean {
    if (!this.webhookAuth) {
      if (!this.hasWarnedAboutMissingSecret) {
        console.warn("RevenueCatProvider: REVENUECAT_WEBHOOK_AUTH is not configured; rejecting all webhooks.");
        this.hasWarnedAboutMissingSecret = true;
      }
      return false;
    }

    const rawHeader = headers["authorization"];
    const header = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;
    if (!header) return false;

    if (this.constantTimeEquals(header, this.webhookAuth)) return true;

    const withoutBearer = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : header;
    return this.constantTimeEquals(withoutBearer, this.webhookAuth);
  }

  private constantTimeEquals(a: string, b: string): boolean {
    const bufferA = Buffer.from(a);
    const bufferB = Buffer.from(b);
    if (bufferA.length !== bufferB.length) return false;
    return crypto.timingSafeEqual(bufferA, bufferB);
  }

  /**
   * Maps a RevenueCat webhook payload to a neutral `SubscriptionEvent`, or `null` when the event
   * type is not relevant to this app (e.g. `TEST`, `TRANSFER`, `SUBSCRIPTION_PAUSED`).
   *
   * Defensive by design: any malformed/unexpected shape resolves to `null` instead of throwing,
   * so a single bad payload cannot crash the webhook endpoint.
   */
  parseWebhookEvent(payload: unknown): SubscriptionEvent | null {
    if (!payload || typeof payload !== "object") return null;

    const { event } = payload as RevenueCatWebhookPayload;
    if (!event || typeof event !== "object") return null;

    const kind = event.type ? EVENT_KIND_BY_TYPE[event.type] : undefined;
    if (!kind) return null;

    const providerCustomerId = event.app_user_id ?? event.original_app_user_id;
    if (!providerCustomerId || !event.id) return null;

    const entitlementId = event.entitlement_ids?.[0] ?? event.entitlement_id ?? null;

    return {
      eventId: event.id,
      kind,
      provider: this.name,
      providerCustomerId,
      // Convention: app_user_id === companyId (see IPaymentProvider.ts).
      companyId: providerCustomerId,
      // Only one paid plan exists in the MVP, so every relevant event maps to BASIC.
      tier: "BASIC" as PlanTierType,
      entitlementId,
      periodStart: this.msToDate(event.purchased_at_ms),
      periodEnd: this.msToDate(event.expiration_at_ms),
    };
  }

  private msToDate(ms: number | undefined): Date | null {
    return typeof ms === "number" ? new Date(ms) : null;
  }
}
