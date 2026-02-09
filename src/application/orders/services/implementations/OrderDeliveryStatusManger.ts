import ApplicationError from "@/application/core/errors/ApplicationError";
import { Order } from "@/domain/orders";
import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import IOrderDeliveryStatusManager from "@/domain/orders/services/IOrderDeliveryStatusManager";

export default class OrderDeliveryStatusManager implements IOrderDeliveryStatusManager {
  constructor(private readonly ordersRepository: IOrderRepository) {}

  async change(orderId: string, status: "PENDING" | "ON_ROUTE" | "IN_TRANSIT" | "DELIVERED" | "RETURNED"): Promise<Order> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new ApplicationError("Order not found", 404);

    order.setDeliveryStatus(status);
    const updatedOrder = await this.ordersRepository.update(order);
    return updatedOrder;
  }
}
