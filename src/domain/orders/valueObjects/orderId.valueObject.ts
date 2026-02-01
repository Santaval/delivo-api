import DomainError from "@/domain/core/errors/DomainError";

export class OrderId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): OrderId {
    if (!value || value.trim().length === 0) {
      throw new DomainError("OrderId cannot be empty");
    }
    return new OrderId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: OrderId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
