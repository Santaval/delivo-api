import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { IOrdersService } from "../interfaces/IOrdersService";
import { Order } from "@/domain/orders";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";

export default class OrdersService implements IOrdersService {
  constructor(
    private readonly ordersRepository: IOrderRepository,
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

  async byClient(clientId: ClientId): Promise<Order[]> {
    return this.ordersRepository.byClient(clientId);
  }
}