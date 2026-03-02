import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import IOrderItemsManager from "../interfaces/IOrderItemsManager";
import { OrderDeliveryStatusType } from "@/domain/orders/valueObjects/orderDeliveryStatus";
import ApplicationError from "@/application/core/errors/ApplicationError";
import { Order, OrderItem } from "@/domain/orders";
import { Product } from "@/domain/products/entities/Product";
import { IProductRepository } from "@/domain/products/repositories/IProductRepository";
import IOrderPricingCalculator from "@/domain/orders/services/IOrderPricingCalculator";

export default class OrderItemsManager implements IOrderItemsManager {
  constructor(
    private readonly ordersRepo: IOrderRepository,
    private readonly productsRepo: IProductRepository,
    private readonly orderPricingCalculator: IOrderPricingCalculator
  ) {}
  static INVALID_STATES: OrderDeliveryStatusType[] = ["DELIVERED", "RETURNED"]

  async addItem(productId: string, quantity: number, orderId: string): Promise<Order> {
    const order = await this.tryFetchOrder(orderId);
    this.checkValidState(order);

    const product = await this.productsRepo.find(productId);
    if (!product) throw new ApplicationError("Product not found", 404);

    const item = this.fromProduct(product, quantity, orderId);
    await this.ordersRepo.addItem(item);

    const updatedorder = await this.orderPricingCalculator.onAddItem(item);
    return this.ordersRepo.update(updatedorder);
  }

  async removeItem(orderId: string, itemId: string): Promise<Order> {
    const order = await this.tryFetchOrder(orderId);
    this.checkValidState(order);

    const item = await this.ordersRepo.getItem(itemId);
    if (!item) throw new ApplicationError("Order item not found", 404);

    await this.ordersRepo.removeItem(orderId, itemId);

    const updatedorder = await this.orderPricingCalculator.onRemoveItem(item);
    return this.ordersRepo.update(updatedorder);
  }

  private checkValidState(order: Order) {
    if (this.isInvalidState(order.deliveryStatus)) throw new ApplicationError("Cannot modify order in current status");
  }

  private async tryFetchOrder(orderId: string): Promise<Order> {
    const order = await this.ordersRepo.findById(orderId);
    if (!order) throw new Error("Order not found");
    return order;
  }

  private isInvalidState(status: OrderDeliveryStatusType): boolean {
    return OrderItemsManager.INVALID_STATES.includes(status);
  }

  private fromProduct(product: Product, quantity: number, orderId: string): OrderItem {
    return new OrderItem({
      id: product.id,
      billId: orderId,
      quantity,
      name: product.name,
      companyId: product.companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      grossPrice: product.pricing.grossPrice,
      itemId: "to-be-filled",
    });
  }

}
