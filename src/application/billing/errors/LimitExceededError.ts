import ApplicationError from "@/application/core/errors/ApplicationError";
import { LimitedResource } from "@/application/billing/PlanCatalog";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";

/** Machine-readable body returned to the client as HTTP 402. */
export interface LimitExceededPayload {
  code: "PLAN_LIMIT_EXCEEDED";
  resource: LimitedResource;
  limit: number;
  used: number;
  tier: PlanTierType;
  upgradeTo: PlanTierType | null;
}

export interface LimitExceededErrorParams {
  resource: LimitedResource;
  limit: number;
  used: number;
  tier: PlanTierType;
  upgradeTo: PlanTierType | null;
}

/**
 * Raised by `EntitlementService.assert` when a company has exhausted a plan-limited
 * resource.
 *
 * Per the pricing doc §2.2, the API never silently blocks: it returns this structured
 * `PLAN_LIMIT_EXCEEDED` payload so the client can render the upgrade screen instead of a
 * generic error. The presentation error handler (issue #16) maps this to HTTP 402.
 */
export class LimitExceededError extends ApplicationError {
  readonly code = "PLAN_LIMIT_EXCEEDED";
  readonly resource: LimitedResource;
  readonly limit: number;
  readonly used: number;
  readonly tier: PlanTierType;
  readonly upgradeTo: PlanTierType | null;

  constructor(params: LimitExceededErrorParams) {
    super(`Plan limit reached for ${params.resource} (${params.used}/${params.limit} on ${params.tier})`);
    this.name = "LimitExceededError";
    this.stack = new Error().stack;
    this.statusCode = 402;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";

    this.resource = params.resource;
    this.limit = params.limit;
    this.used = params.used;
    this.tier = params.tier;
    this.upgradeTo = params.upgradeTo;
  }

  /** Machine-readable body returned to the client as HTTP 402. */
  toPayload(): LimitExceededPayload {
    return {
      code: this.code,
      resource: this.resource,
      limit: this.limit,
      used: this.used,
      tier: this.tier,
      upgradeTo: this.upgradeTo,
    };
  }
}
