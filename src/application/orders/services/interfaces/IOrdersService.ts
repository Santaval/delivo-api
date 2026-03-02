import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { Order } from "@/domain/orders";

export interface IOrdersService {
  findByCompany(companyId: string): Promise<Order[]>;
  openedByCompany(companyId: string): Promise<Order[]>; // opened orders (not delivered)
  closedByCompany(companyId: string): Promise<Order[]>; // closed orders (delivered)
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  delete(id: string): Promise<void>;
  update(order: Order): Promise<Order>;
  markAsDelivered(id: string): Promise<Order>;
  byClient(clientId: ClientId): Promise<Order[]>;
}
