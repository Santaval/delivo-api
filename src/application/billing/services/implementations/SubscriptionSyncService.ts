import { ISubscriptionSyncService } from "@/application/billing/services/interfaces/ISubscriptionSyncService";
import { SubscriptionEvent, SubscriptionEventKind } from "@/domain/billing/providers/IPaymentProvider";
import { ISubscriptionRepository } from "@/domain/billing/repositories/ISubscriptionRepository";
import { SubscriptionStatusType } from "@/domain/billing/valueObjects/subscriptionStatus.valueObject";

/** Maps a provider-neutral event kind to the resulting `Subscription.status`. */
const STATUS_BY_EVENT_KIND: Record<SubscriptionEventKind, SubscriptionStatusType> = {
  ACTIVATED: "ACTIVE",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  BILLING_ISSUE: "IN_GRACE_PERIOD",
};

/**
 * Applies provider billing events (currently only RevenueCat) to the company's subscription.
 *
 * Idempotency: the whole desired subscription state (tier, status, period bounds) is derived
 * solely from the incoming event payload and written with a single upsert keyed by companyId.
 * Replaying the same event therefore just writes the same row again — a no-op in effect. No
 * event log/dedup table is needed for this MVP.
 */
export class SubscriptionSyncService implements ISubscriptionSyncService {
  constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

  async applyEvent(event: SubscriptionEvent): Promise<void> {
    const status = STATUS_BY_EVENT_KIND[event.kind];

    // Note: on EXPIRED we still persist tier: BASIC alongside status: EXPIRED — we don't
    // downgrade the stored tier here. `Subscription.effectiveTier()` already treats a
    // non-active subscription as FREE, so the downgrade happens at the read side without
    // losing the historical "what plan were they on" information. This is the
    // "downgrade without blocking" rule from the pricing doc.
    const subscription = await this.subscriptionRepository.upsertByProviderCustomerId({
      companyId: event.companyId,
      tier: event.tier,
      status,
      provider: event.provider,
      providerCustomerId: event.providerCustomerId,
      providerEntitlement: event.entitlementId,
      currentPeriodStart: event.periodStart,
      currentPeriodEnd: event.periodEnd,
    });

    console.log(
      `SubscriptionSyncService: applied event ${event.eventId} (${event.kind}) for company ${event.companyId} -> status=${subscription.status}`,
    );
  }
}
