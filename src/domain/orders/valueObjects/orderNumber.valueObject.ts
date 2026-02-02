import DataError from "@/domain/core/errors/DataError";
import DomainError from "@/domain/core/errors/DomainError";

export class OrderNumber {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): OrderNumber {
    if (!value) {
      throw new DataError("Order number cannot be empty");
    }

    // You can add additional validation here for order number format
    if (value < 1) {
      throw new DataError("Order number must be a positive integer");
    }

    return new OrderNumber(value);
  }

  get value(): number {
    return this._value;
  }

  equals(other: OrderNumber): boolean {
    return this._value === other._value;
  }
}
