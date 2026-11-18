import { LimitedResource } from "@/application/billing/PlanCatalog";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";

export interface EntitlementCheck {
  resource: LimitedResource;
  limit: number | null; // null = unlimited
  used: number;
  remaining: number | null; // null = unlimited
  allowed: boolean;
}

export interface IEntitlementService {
  /** Effective tier in force for the company (always FREE until plan limits are removed in #70). */
  effectiveTier(companyId: string): Promise<PlanTierType>;
  check(companyId: string, resource: LimitedResource): Promise<EntitlementCheck>;
  /** Throws LimitExceededError when the resource is exhausted. */
  assert(companyId: string, resource: LimitedResource): Promise<void>;
  /** Every limited resource at once, for the status endpoint. */
  summary(companyId: string): Promise<EntitlementCheck[]>;
}
