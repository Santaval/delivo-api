import DomainError from "@/domain/core/errors/DomainError";

export type OrderStatusType = "PENDING" | "PAID" | "CANCELLED";

export class OrderStatus {
  private readonly _value: OrderStatusType;

  private constructor(value: OrderStatusType) {
    this._value = value;
  }

  static create(value: string): OrderStatus {
    const validStatuses: OrderStatusType[] = ["PENDING", "PAID", "CANCELLED"];
    
    if (!validStatuses.includes(value as OrderStatusType)) {
      throw new DomainError(`Invalid order status: ${value}. Valid statuses are: ${validStatuses.join(", ")}`);
    }

    return new OrderStatus(value as OrderStatusType);
  }

  static pending(): OrderStatus {
    return new OrderStatus("PENDING");
  }

  static paid(): OrderStatus {
    return new OrderStatus("PAID");
  }

  static cancelled(): OrderStatus {
    return new OrderStatus("CANCELLED");
  }

  get value(): OrderStatusType {
    return this._value;
  }

  isPending(): boolean {
    return this._value === "PENDING";
  }

  isPaid(): boolean {
    return this._value === "PAID";
  }

  isCancelled(): boolean {
    return this._value === "CANCELLED";
  }

  canTransitionTo(newStatus: OrderStatus): boolean {
    // Define business rules for status transitions
    switch (this._value) {
      case "PENDING":
        return newStatus._value === "PAID" || newStatus._value === "CANCELLED";
      case "PAID":
        return false; // Paid orders cannot be changed
      case "CANCELLED":
        return false; // Cancelled orders cannot be changed
      default:
        return false;
    }
  }

  equals(other: OrderStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
