import { LIMITED_RESOURCES, LimitedResource, limitFor, upgradeTargetFor } from "@/application/billing/PlanCatalog";
import { LimitExceededError } from "@/application/billing/errors/LimitExceededError";
import { EntitlementCheck, IEntitlementService } from "@/application/billing/services/interfaces/IEntitlementService";
import { IUsageService } from "@/application/billing/services/interfaces/IUsageService";
import { ISubscriptionRepository } from "@/domain/billing/repositories/ISubscriptionRepository";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";

/**
 * Central decision point for plan enforcement (Billing MVP): combines the company's
 * effective tier (subscription), the plan catalog limit for a resource, and the
 * resource's current usage into a single allow/deny answer.
 */
export class EntitlementService implements IEntitlementService {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly usageService: IUsageService,
  ) { }

  /** Effective tier in force for the company (no subscription or a lapsed one => FREE). */
  async effectiveTier(companyId: string): Promise<PlanTierType> {
    const subscription = await this.subscriptionRepository.findByCompanyId(companyId);
    // Defensive fallback: #19 owns creation/backfill of the default FREE subscription
    // row, so a missing row here should not happen in steady state, but is still FREE.
    if (!subscription) return "FREE";

    // The entity itself downgrades a lapsed/expired subscription to FREE.
    return subscription.effectiveTier();
  }

  async check(companyId: string, resource: LimitedResource): Promise<EntitlementCheck> {
    const tier = await this.effectiveTier(companyId);
    return this.checkForTier(companyId, tier, resource);
  }

  /** Throws LimitExceededError when the resource is exhausted. */
  async assert(companyId: string, resource: LimitedResource): Promise<void> {
    const tier = await this.effectiveTier(companyId);
    const result = await this.checkForTier(companyId, tier, resource);

    if (!result.allowed) {
      throw new LimitExceededError({
        resource,
        limit: result.limit as number,
        used: result.used,
        tier,
        upgradeTo: upgradeTargetFor(tier),
      });
    }
  }

  /** Every limited resource at once, for the status endpoint. */
  async summary(companyId: string): Promise<EntitlementCheck[]> {
    const tier = await this.effectiveTier(companyId);
    return Promise.all(LIMITED_RESOURCES.map((resource) => this.checkForTier(companyId, tier, resource)));
  }

  /** Shared arithmetic for check/assert/summary, given an already-resolved tier. */
  private async checkForTier(companyId: string, tier: PlanTierType, resource: LimitedResource): Promise<EntitlementCheck> {
    const limit = limitFor(tier, resource);
    const used = await this.usageService.currentUsage(companyId, resource);

    if (limit === null) {
      return { resource, limit: null, used, remaining: null, allowed: true };
    }

    return {
      resource,
      limit,
      used,
      remaining: Math.max(0, limit - used),
      allowed: used < limit,
    };
  }
}
