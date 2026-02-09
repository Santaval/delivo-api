import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { IOrdersService } from "../interfaces/IOrdersService";
import { Order, OrderItem } from "@/domain/orders";
import ApplicationError from "@/application/core/errors/ApplicationError";
import IOrderPricingCalculator from "@/domain/orders/services/IOrderPricingCalculator";
import { IProductRepository } from "@/domain/products/repositories/IProductRepository";
import { Product } from "@/domain/products/entities/Product";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";

export default class OrdersService implements IOrdersService {
  constructor(
    private readonly ordersRepository: IOrderRepository,
    private readonly productsRepository: IProductRepository,
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

  async addItem(productId: string, quantity: number, orderId: string): Promise<Order> {
    const product = await this.productsRepository.find(productId);
    if (!product) throw new ApplicationError("Product not found", 404);

    const item = this.fromProduct(product, quantity, orderId);

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

  async byClient(clientId: ClientId): Promise<Order[]> {
    return this.ordersRepository.byClient(clientId);
  }

  fromProduct(product: Product, quantity: number, orderId: string): OrderItem {
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