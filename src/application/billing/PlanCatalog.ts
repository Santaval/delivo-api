import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";

/**
 * Plan catalog — single source of truth for entitlement limits (Billing MVP).
 *
 * Limits live in **code**, not in the database: there is one row of truth here per
 * `PlanTierType`, matching the MVP pricing table (Gratis / Arranque). Any change to
 * pricing/limits ships as a code change reviewed like any other, not a data migration.
 *
 * Per the pricing doc §2.2, entitlements are advisory, not hard walls: usage is never
 * blocked mid-sale. The API only returns a structured error once a limit is exceeded;
 * the client owns the 80%/100% warning UX (nudging the user to upgrade before they hit
 * the ceiling). This file only describes the limits and their time windows — enforcement
 * (issue #14/#15) and warning thresholds are the caller's responsibility.
 */

/** Resources whose usage counts against a plan's limits. */
export type LimitedResource = "documents" | "routes" | "clients" | "products" | "drivers";

/** How a resource's usage is counted: per calendar month, per day, or as an absolute total. */
export type UsageWindow = "monthly" | "daily" | "total";

/** `null` means unlimited. */
export interface PlanLimits {
  documents: number | null;
  routes: number | null;
  clients: number | null;
  products: number | null;
  drivers: number | null;
}

export const LIMITED_RESOURCES: LimitedResource[] = ["documents", "routes", "clients", "products", "drivers"];

/**
 * Limits per plan tier, matching the MVP pricing table (Gratis / Arranque).
 *
 * - `documents`: fiscal documents issued in the current calendar month. Proxied by
 *   `ClientBill` creation until Hacienda e-invoicing exists (see BILLING_PLAN.md).
 * - `routes`: optimized delivery routes generated in the current calendar day.
 * - `clients`: active clients in the CRM (absolute count, soft-deleted excluded).
 * - `products`: products in the catalog (absolute count, soft-deleted excluded).
 * - `drivers`: company members with the `DEALER` company role (absolute count).
 */
export const PLAN_CATALOG: Record<PlanTierType, PlanLimits> = {
  FREE: { documents: 10, routes: 1, clients: 25, products: 20, drivers: 1 },
  BASIC: { documents: 100, routes: null, clients: null, products: null, drivers: 1 },
};

/**
 * Temporal window each resource is evaluated over, regardless of plan tier.
 *
 * - `documents` → "monthly": resets at the start of each calendar month
 *   (America/Costa_Rica), since it counts fiscal documents issued during the month.
 * - `routes` → "daily": resets at the start of each calendar day
 *   (America/Costa_Rica), since it counts optimized routes generated during the day.
 * - `clients` / `products` / `drivers` → "total": absolute counts with no reset window.
 */
export const RESOURCE_WINDOWS: Record<LimitedResource, UsageWindow> = {
  documents: "monthly",
  routes: "daily",
  clients: "total",
  products: "total",
  drivers: "total",
};

/** Limit for `resource` under `tier`. `null` means unlimited. */
export function limitFor(tier: PlanTierType, resource: LimitedResource): number | null {
  return PLAN_CATALOG[tier][resource];
}

/** Temporal window `resource` is evaluated over. */
export function windowFor(resource: LimitedResource): UsageWindow {
  return RESOURCE_WINDOWS[resource];
}

/** Tier the client should be upsold to when `tier` runs out of a resource; null when already on the top tier. */
export function upgradeTargetFor(tier: PlanTierType): PlanTierType | null {
  switch (tier) {
    case "FREE":
      return "BASIC";
    case "BASIC":
      return null;
  }
}
