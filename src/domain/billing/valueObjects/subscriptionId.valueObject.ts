import DataException from "@/domain/core/errors/DataError";

export class SubscriptionId {
  private readonly _value: string
  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    if (!value) throw new DataException("SubscriptionId cannot be empty");
    return new SubscriptionId(value.trim());
  }

  get value() {
    return this._value;
  }
}
