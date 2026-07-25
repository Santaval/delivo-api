import DataException from "@/domain/core/errors/DataError";

export type SubscriptionStatusType = "ACTIVE" | "IN_GRACE_PERIOD" | "EXPIRED" | "CANCELLED";

export const SUBSCRIPTION_STATUSES: SubscriptionStatusType[] = [
  "ACTIVE",
  "IN_GRACE_PERIOD",
  "EXPIRED",
  "CANCELLED",
];

export class SubscriptionStatus {
  private readonly _value: SubscriptionStatusType;

  private constructor(value: SubscriptionStatusType) {
    this._value = value;
  }

  static create(value: string): SubscriptionStatus {
    if (!SUBSCRIPTION_STATUSES.includes(value as SubscriptionStatusType)) {
      throw new DataException(`Invalid subscription status: ${value}. Valid statuses are: ${SUBSCRIPTION_STATUSES.join(", ")}`);
    }

    return new SubscriptionStatus(value as SubscriptionStatusType);
  }

  get value(): SubscriptionStatusType {
    return this._value;
  }
}
