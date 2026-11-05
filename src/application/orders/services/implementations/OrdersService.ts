import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { BillsPage, BillsPageParams, IOrdersService } from "../interfaces/IOrdersService";
import { PageRequest } from "@/domain/core/pagination/Pagination";
import { Order } from "@/domain/orders";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { OrderDeliveryStatusType } from "@/domain/orders/valueObjects/orderDeliveryStatus";
import ApplicationError from "@/application/core/errors/ApplicationError";

export default class OrdersService implements IOrdersService {

  CLOSED_STATES: OrderDeliveryStatusType[] = ["DELIVERED"];
  OPENED_STATES: OrderDeliveryStatusType[] = ["PENDING", "ON_ROUTE" ,"IN_TRANSIT"];

  constructor(
    private readonly ordersRepository: IOrderRepository,
  ) {}
  findByCompany(companyId: string): Promise<Order[]> {
    return this.ordersRepository.findByCompany(companyId);
  }

  closedByCompany(companyId: string): Promise<Order[]> {
    return this.ordersRepository.byCompanyAndManyDeliveryStatus(companyId, this.CLOSED_STATES);
  }

  async paginatedBills(params: BillsPageParams, page: PageRequest): Promise<BillsPage> {
    const filter = {
      companyId: params.companyId,
      deliveryStatuses: this.CLOSED_STATES,
      search: params.search,
    };
    const [result, counts] = await Promise.all([
      this.ordersRepository.paginatedBills({ ...filter, status: params.status }, page),
      this.ordersRepository.countBillsByStatus(filter),
    ]);
    return { ...result, counts };
  }

  openedByCompany(companyId: string): Promise<Order[]> {
    return this.ordersRepository.byCompanyAndManyDeliveryStatus(companyId, this.OPENED_STATES);
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

  async markAsDelivered(id: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);
    if (!order) throw new ApplicationError("Order not found");
    order.setDeliveryStatus("DELIVERED");
    const updated = await this.ordersRepository.update(order);
    return updated;
  }

  async byClient(clientId: ClientId): Promise<Order[]> {
    return this.ordersRepository.byClientAndManyDeliveryStatus(clientId, this.OPENED_STATES);
  }

  async byClientBilled(clientId: ClientId): Promise<Order[]> {
    return this.ordersRepository.byClientAndManyDeliveryStatus(clientId, this.CLOSED_STATES);
  }
}