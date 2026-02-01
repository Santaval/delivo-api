import DomainError from "@/domain/core/errors/DomainError";

export class OrderNumber {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): OrderNumber {
    if (!value || value.trim().length === 0) {
      throw new DomainError("Order number cannot be empty");
    }

    // You can add additional validation here for order number format
    if (value.length > 20) {
      throw new DomainError("Order number cannot be longer than 20 characters");
    }

    return new OrderNumber(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: OrderNumber): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
