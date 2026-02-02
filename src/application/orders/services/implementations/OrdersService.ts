import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { IOrdersService } from "../interfaces/IOrdersService";
import { Order, OrderItem } from "@/domain/orders";

export default class OrdersService implements IOrdersService {
  constructor(
    private readonly ordersRepository: IOrderRepository
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

  addItem(orderId: string, item: OrderItem): Promise<Order> {
    return this.ordersRepository.addItem(orderId, item);
  }

  removeItem(orderId: string, itemId: string): Promise<Order> {
    return this.ordersRepository.removeItem(orderId, itemId);
  }
}