import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import Order from "../entities/Order";
import OrderItem from "../entities/OrderItem";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { OrderDeliveryStatusType } from "../valueObjects/orderDeliveryStatus";

export default interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByCompany(companyId: string): Promise<Order[]>;
  byCompanyAndManyDeliveryStatus(companyId: string, statuses: OrderDeliveryStatusType[]): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  addItem(item: OrderItem): Promise<Order>;
  removeItem(orderId: string, itemId: string): Promise<Order>;
  getItem(itemId: string): Promise<OrderItem | null>;
  byTimeRange(start: Date, end: Date, companyId: CompanyId): Promise<Order[]>;
  byClientAndManyDeliveryStatus(clientId: ClientId, statuses: OrderDeliveryStatusType[]): Promise<Order[]>;
  /**
   * Count fiscal documents (`ClientBill`) issued by a company within a half-open date range `[start, end)`.
   * @param companyId The ID of the company.
   * @param start Inclusive lower bound of `issueDate`.
   * @param end Exclusive upper bound of `issueDate`.
   * @returns A promise that resolves to the number of matching documents.
   */
  countByCompanyAndIssueDateRange(companyId: string, start: Date, end: Date): Promise<number>;
}
