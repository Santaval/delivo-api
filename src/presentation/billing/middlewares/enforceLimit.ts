import { NextFunction, Request, Response } from "express";
import { entitlementService } from "@/dependencyInjection/container";
import { LimitedResource } from "@/application/billing/PlanCatalog";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";

export interface EnforceLimitOptions {
  /** How to resolve the company under enforcement. Defaults to the `x-company-id` header. */
  companyId?: (req: Request) => string | undefined;
  /** Only enforce when this predicate is true (e.g. only DEALER invitations consume the driver seat). */
  when?: (req: Request) => boolean;
}

/**
 * Middleware factory that enforces the plan limit for a given billing resource before the
 * request reaches the creation handler.
 *
 * Mount it **after** `requireCompanyId` (or supply `options.companyId` for `:companyId`-param
 * routes) so the company context is already resolved.
 *
 * Per the pricing doc §2.2, the API never silently blocks a limited action: when a company has
 * exhausted a resource this middleware forwards a `LimitExceededError` to the central error
 * handler, which responds with a structured HTTP 402 payload. It is the client's responsibility
 * to interpret that payload and drive the upgrade/purchase UX — this middleware only enforces.
 */
export default function enforceLimit(resource: LimitedResource, options: EnforceLimitOptions = {}) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (options.when && !options.when(req)) {
      next();
      return;
    }

    const companyId = (options.companyId ?? CompanyIdParser)(req);
    if (!companyId) {
      res.status(400).json({ message: "Company ID is required" });
      return;
    }

    try {
      await entitlementService.assert(companyId, resource);
      next();
    } catch (error) {
      next(error);
    }
  };
}
