import DataError from "@/domain/core/errors/DataError";

export default class PaymentMethodName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PaymentMethodName {
    if (!value || value.trim().length === 0) {
      throw new DataError("PaymentMethodName cannot be empty");
    }
    return new PaymentMethodName(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PaymentMethodName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
