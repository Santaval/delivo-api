import DomainError from "@/domain/core/errors/DomainError";

//  PENDING
//   ON_ROUTE
//   IN_TRANSIT
//   DELIVERED
//   RETURNED

export type OrderDeliveryStatusType = "PENDING" | "ON_ROUTE" | "IN_TRANSIT" | "DELIVERED" | "RETURNED";

export class OrderDeliveryStatus {
  private readonly _value: OrderDeliveryStatusType;

  private constructor(value: OrderDeliveryStatusType) {
    this._value = value;
  }

  static create(value: string): OrderDeliveryStatus {
    const validStatuses: OrderDeliveryStatusType[] = ["PENDING", "ON_ROUTE", "IN_TRANSIT", "DELIVERED", "RETURNED"];

    if (!validStatuses.includes(value as OrderDeliveryStatusType)) {
      throw new DomainError(`Invalid order delivery status: ${value}. Valid statuses are: ${validStatuses.join(", ")}`);
    }

    return new OrderDeliveryStatus(value as OrderDeliveryStatusType);
  }

  get value(): OrderDeliveryStatusType {
    return this._value;
  }
}
