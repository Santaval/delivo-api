import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { IOrdersService } from "../interfaces/IOrdersService";
import { Order, OrderItem } from "@/domain/orders";
import ApplicationError from "@/application/core/errors/ApplicationError";
import IOrderPricingCalculator from "@/domain/orders/services/IOrderPricingCalculator";

export default class OrdersService implements IOrdersService {
  constructor(
    private readonly ordersRepository: IOrderRepository,
    private readonly orderPricingCalculator: IOrderPricingCalculator
  ) {}
  findByCompany(companyId: string): Promise<Order[]> {
    return this.ordersRepository.findByCompany(companyId);
  }

  create(order: Order): Promise<Order> {
    return this.ordersRepository.create(order);
  }

  findById(id: string): Promise<Order | null> {
    return this.ordersRepository.findById(id);
  }

  delete(id: string): Promise<void> {
    return this.ordersRepository.delete(id);
  }

  update(order: Order): Promise<Order> {
    return this.ordersRepository.update(order);
  }

  async addItem(item: OrderItem): Promise<Order> {

    const updatedPricing = await this.orderPricingCalculator.onAddItem(item);
    if (!updatedPricing) throw new ApplicationError("Failed to update pricing", 400);

    await this.update(updatedPricing);
    return this.ordersRepository.addItem(item);
  }

  async removeItem(orderId: string, itemId: string): Promise<Order> {
    const orderItem = await this.ordersRepository.getItem(itemId);
    if (!orderItem) throw new ApplicationError("Order item not found", 404);

    const updatedPricing = await this.orderPricingCalculator.onRemoveItem(orderItem);
    if (!updatedPricing) throw new ApplicationError("Failed to update pricing", 400);

    await this.update(updatedPricing);
    return this.ordersRepository.removeItem(orderId, itemId);
  }
}