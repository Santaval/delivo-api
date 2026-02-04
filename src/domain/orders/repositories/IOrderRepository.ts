import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import Order from "../entities/Order";
import OrderItem from "../entities/OrderItem";

export default interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByCompany(companyId: string): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  addItem(item: OrderItem): Promise<Order>;
  removeItem(orderId: string, itemId: string): Promise<Order>;
  getItem(itemId: string): Promise<OrderItem | null>;
  byTimeRange(start: Date, end: Date, companyId: CompanyId): Promise<Order[]>;
}
