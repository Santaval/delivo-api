import { LimitedResource } from "@/application/billing/PlanCatalog";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";
import { SubscriptionStatusType } from "@/domain/billing/valueObjects/subscriptionStatus.valueObject";

export interface ResourceUsageResponse {
  resource: LimitedResource;
  limit: number | null; // null = unlimited
  used: number;
  remaining: number | null; // null = unlimited
  percentUsed: number; // 0 for unlimited resources
}

export interface SubscriptionStatusResponse {
  tier: PlanTierType;
  status: SubscriptionStatusType;
  currentPeriodEnd: string | null; // ISO 8601, null on FREE (never expires)
  limits: ResourceUsageResponse[];
}
