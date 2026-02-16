import DomainError from "@/domain/core/errors/DomainError";

export class PaymentMethodId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PaymentMethodId {
    if (!value || value.trim().length === 0) {
      throw new DomainError("PaymentMethodId cannot be empty");
    }
    return new PaymentMethodId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PaymentMethodId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
