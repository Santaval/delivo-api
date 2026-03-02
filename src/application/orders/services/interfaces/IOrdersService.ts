import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { Order } from "@/domain/orders";

export interface IOrdersService {
  findByCompany(companyId: string): Promise<Order[]>;
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  delete(id: string): Promise<void>;
  update(order: Order): Promise<Order>;
  byClient(clientId: ClientId): Promise<Order[]>;
}
