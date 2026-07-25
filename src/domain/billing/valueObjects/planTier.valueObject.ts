import DataException from "@/domain/core/errors/DataError";

export type PlanTierType = "FREE" | "BASIC";

export const PLAN_TIERS: PlanTierType[] = ["FREE", "BASIC"];

export class PlanTier {
  private readonly _value: PlanTierType;

  private constructor(value: PlanTierType) {
    this._value = value;
  }

  static create(value: string): PlanTier {
    if (!PLAN_TIERS.includes(value as PlanTierType)) {
      throw new DataException(`Invalid plan tier: ${value}. Valid tiers are: ${PLAN_TIERS.join(", ")}`);
    }

    return new PlanTier(value as PlanTierType);
  }

  get value(): PlanTierType {
    return this._value;
  }
}
