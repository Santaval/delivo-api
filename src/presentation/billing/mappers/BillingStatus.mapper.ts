import { EntitlementCheck } from "@/application/billing/services/interfaces/IEntitlementService";
import { Subscription } from "@/domain/billing/entities/Subscription";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";
import { ResourceUsageResponse, SubscriptionStatusResponse } from "../responses/SubscriptionStatusResponse";

export default class BillingStatusMapper {
  /**
   * Builds the billing status payload the client uses to render the 80%/100% warnings
   * and the upgrade screen (pricing §2.2).
   *
   * Note the two fields are deliberately sourced differently: `tier` is the **effective**
   * tier resolved by the entitlement service (a lapsed BASIC reports FREE, because that is
   * what is actually being enforced), while `status` is the **stored** subscription status.
   * The client needs both: `status` is what explains *why* the tier dropped (EXPIRED,
   * CANCELLED, IN_GRACE_PERIOD).
   */
  static toResponse(
    subscription: Subscription | null,
    tier: PlanTierType,
    checks: EntitlementCheck[],
  ): SubscriptionStatusResponse {
    return {
      tier,
      // No subscription row yet (defensive — see #19's default/backfill): behaves as an
      // active FREE plan that never expires.
      status: subscription?.status ?? "ACTIVE",
      currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
      limits: checks.map((check) => BillingStatusMapper.toResourceUsage(check)),
    };
  }

  private static toResourceUsage(check: EntitlementCheck): ResourceUsageResponse {
    return {
      resource: check.resource,
      limit: check.limit,
      used: check.used,
      remaining: check.remaining,
      percentUsed: BillingStatusMapper.percentUsed(check.limit, check.used),
    };
  }

  /** Unlimited resources report 0% (never divide by a null limit); a 0 limit is always 100%. */
  private static percentUsed(limit: number | null, used: number): number {
    if (limit === null) return 0;
    if (limit === 0) return 100;
    return Math.min(100, Math.round((used / limit) * 100));
  }
}
