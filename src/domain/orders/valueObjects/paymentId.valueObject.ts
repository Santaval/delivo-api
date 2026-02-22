import DomainError from "@/domain/core/errors/DomainError";

export class PaymentId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): PaymentId {
    if (!value || value.trim().length === 0) {
      throw new DomainError("PaymentId cannot be empty");
    }
    return new PaymentId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: PaymentId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
