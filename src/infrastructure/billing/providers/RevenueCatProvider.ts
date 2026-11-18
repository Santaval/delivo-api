import crypto from "crypto";
import { CreditEnvironment, CreditEvent, CreditEventKind, IPaymentProvider } from "@/domain/billing/providers/IPaymentProvider";
import { PaymentProviderType } from "@/domain/billing/valueObjects/paymentProvider.valueObject";
import InfrastructureError from "@/infrastructure/core/errors/InfrastructureError";

/** RevenueCat `cancel_reason` of a CANCELLATION caused by a store refund. */
const REFUND_CANCEL_REASON = "CUSTOMER_SUPPORT";

interface RevenueCatWebhookEvent {
  id?: string;
  type?: string;
  app_user_id?: string;
  original_app_user_id?: string;
  product_id?: string;
  transaction_id?: string;
  environment?: string;
  cancel_reason?: string;
  purchased_at_ms?: number;
  event_timestamp_ms?: number;
}

interface RevenueCatWebhookPayload {
  api_version?: string;
  event?: RevenueCatWebhookEvent;
}

/**
 * Infrastructure adapter for RevenueCat, implementing the provider-agnostic `IPaymentProvider`
 * port. Only handles webhook verification and payload parsing.
 */
export default class RevenueCatProvider implements IPaymentProvider {
  readonly name: PaymentProviderType = "REVENUECAT";

  private hasWarnedAboutMissingSecret = false;
  private hasWarnedAboutMissingApiKey = false;

  constructor(
    private readonly webhookAuth: string,
    private readonly apiKey: string,
  ) {}

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
   * Maps a RevenueCat webhook payload to a neutral `CreditEvent`, or `null` when the event is
   * not relevant to this app: only `NON_RENEWING_PURCHASE` (PURCHASE) and a `CANCELLATION` with
   * `cancel_reason = CUSTOMER_SUPPORT`, i.e. a store refund (REFUND), are mapped. Everything
   * else (other cancel reasons, `TRANSFER`, `TEST`, subscription events) resolves to `null`.
   * Whether the product is a known credit pack is application policy and is not checked here.
   *
   * Defensive by design: any malformed/unexpected shape resolves to `null` instead of throwing,
   * so a single bad payload cannot crash the webhook endpoint.
   */
  parseWebhookEvent(payload: unknown): CreditEvent | null {
    if (!payload || typeof payload !== "object") return null;

    const { event } = payload as RevenueCatWebhookPayload;
    if (!event || typeof event !== "object") return null;

    let kind: CreditEventKind | null = null;
    if (event.type === "NON_RENEWING_PURCHASE") kind = "PURCHASE";
    else if (event.type === "CANCELLATION" && event.cancel_reason === REFUND_CANCEL_REASON) kind = "REFUND";
    if (!kind) return null;

    const appUserId = event.app_user_id ?? event.original_app_user_id;
    if (!event.id || !appUserId || !event.transaction_id || !event.product_id) return null;

    return {
      eventId: event.id,
      kind,
      // Convention: app_user_id === companyId (see IPaymentProvider.ts).
      companyId: appUserId,
      transactionId: event.transaction_id,
      productId: event.product_id,
      environment: this.toEnvironment(event.environment),
      occurredAt: this.msToDate(event.event_timestamp_ms ?? event.purchased_at_ms) ?? new Date(),
    };
  }

  private toEnvironment(value: string | undefined): CreditEnvironment | null {
    const upper = typeof value === "string" ? value.toUpperCase() : null;
    return upper === "SANDBOX" || upper === "PRODUCTION" ? upper : null;
  }

  private msToDate(ms: number | undefined): Date | null {
    return typeof ms === "number" ? new Date(ms) : null;
  }

  /**
   * Deletes the RevenueCat subscriber for a given companyId (app_user_id === companyId
   * convention). Used during account deletion so the provider stops associating purchases
   * with a company that no longer exists.
   *
   * Idempotent: 200/204 (gone) and 404 (already gone) are all treated as success.
   * Silently skips when REVENUECAT_API_KEY is not configured, so a deployment without
   * it still allows account deletion to succeed. Any other failure throws
   * InfrastructureError; the caller logs and moves on, never reverting the DB deletion.
   */
  async deleteSubscriber(providerCustomerId: string): Promise<void> {
    if (!this.apiKey) {
      if (!this.hasWarnedAboutMissingApiKey) {
        console.warn("RevenueCatProvider: deleteSubscriber skipped, REVENUECAT_API_KEY is not configured.");
        this.hasWarnedAboutMissingApiKey = true;
      }
      return;
    }

    const url = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(providerCustomerId)}`;
    let response: Response;
    try {
      response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-Platform": "ios",
        },
      });
    } catch (error) {
      throw new InfrastructureError("RevenueCat deleteSubscriber network error");
    }

    // 200/204: deleted. 404: already gone. Anything else is a real failure.
    if (response.status !== 200 && response.status !== 204 && response.status !== 404) {
      throw new InfrastructureError(
        `RevenueCat deleteSubscriber failed (status ${response.status})`
      );
    }
  }
}
