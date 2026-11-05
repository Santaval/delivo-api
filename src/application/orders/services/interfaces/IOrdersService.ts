import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { Order, OrderStatusType } from "@/domain/orders";
import { PageRequest, PaginatedResult } from "@/domain/core/pagination/Pagination";
import { BillStatusCounts } from "@/domain/orders/repositories/BillsQuery";

export interface BillsPageParams {
  companyId: string;
  status?: OrderStatusType;
  search?: string;
}

export interface BillsPage extends PaginatedResult<Order> {
  /** Per-status totals for the same company + search, so tab badges stay accurate. */
  counts: BillStatusCounts;
}

export interface IOrdersService {
  findByCompany(companyId: string): Promise<Order[]>;
  openedByCompany(companyId: string): Promise<Order[]>; // opened orders (not delivered)
  closedByCompany(companyId: string): Promise<Order[]>; // closed orders (delivered)
  paginatedBills(params: BillsPageParams, page: PageRequest): Promise<BillsPage>; // closed orders, paginated
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  delete(id: string): Promise<void>;
  update(order: Order): Promise<Order>;
  markAsDelivered(id: string): Promise<Order>;
  byClient(clientId: ClientId): Promise<Order[]>;
  byClientBilled(clientId: ClientId): Promise<Order[]>;
}
