import Order from "../entities/Order";

export default interface IOrderDeliveryStatusManager {
  change(orderId: string, status: "PENDING" | "ON_ROUTE" | "IN_TRANSIT" | "DELIVERED" | "RETURNED"): Promise<Order>;
}
