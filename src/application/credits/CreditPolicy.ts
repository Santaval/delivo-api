/**
 * Credit pricing and limits for pay-per-bill. They live in code, not in the database, so
 * every pricing change goes through code review (same idea as the former `PlanCatalog`).
 */

/** Credits granted to every new company, in the same transaction as its creation. */
export const WELCOME_CREDITS = 50;

/** Lowest balance a bill may leave behind: issuing is allowed while balance - cost >= this. */
export const OVERDRAFT_FLOOR = -5;

/** Credits charged for each issued bill. */
export const CREDITS_PER_BILL = 1;

/** Store product id -> credits granted by buying it. */
export const CREDIT_PACKS: Readonly<Record<string, number>> = {
  delivo_bills_100: 100,
};

/** Credits for a purchased product id, or null when it is not a known credit pack. */
export function creditsForProduct(productId: string): number | null {
  return CREDIT_PACKS[productId] ?? null;
}
