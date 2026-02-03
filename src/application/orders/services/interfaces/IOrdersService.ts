import { Order, OrderItem } from "@/domain/orders";

export interface IOrdersService {
  findByCompany(companyId: string): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  delete(id: string): Promise<void>;
  update(order: Order): Promise<Order>;
  addItem(productId: string, quantity: number, orderId: string): Promise<Order>;
  removeItem(orderId: string, itemId: string): Promise<Order>;
}
