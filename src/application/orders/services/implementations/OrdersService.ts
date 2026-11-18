import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import { BillsPage, BillsPageParams, IOrdersService } from "../interfaces/IOrdersService";
import { PageRequest } from "@/domain/core/pagination/Pagination";
import { Order } from "@/domain/orders";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { OrderDeliveryStatusType } from "@/domain/orders/valueObjects/orderDeliveryStatus";
import ApplicationError from "@/application/core/errors/ApplicationError";
import { IBillIssuingUnitOfWork } from "@/domain/orders/unitsOfWork/BillIssuingUnitOfWork";
import { CREDITS_PER_BILL, OVERDRAFT_FLOOR } from "@/application/credits/CreditPolicy";
import { InsufficientCreditsError } from "@/application/credits/errors/InsufficientCreditsError";

export default class OrdersService implements IOrdersService {

  CLOSED_STATES: OrderDeliveryStatusType[] = ["DELIVERED"];
  OPENED_STATES: OrderDeliveryStatusType[] = ["PENDING", "ON_ROUTE" ,"IN_TRANSIT"];

  constructor(
    private readonly ordersRepository: IOrderRepository,
    private readonly billIssuingUOW: IBillIssuingUnitOfWork,
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

  /**
   * Issues a bill: debits one credit, creates the bill and records the ledger row in a single
   * transaction. Debit goes first so an insufficient balance never creates a bill (and never
   * burns a ClientBill.number); if the bill insert fails, the debit rolls back.
   * @throws InsufficientCreditsError when the balance would drop below the overdraft floor.
   */
  create(order: Order): Promise<Order> {
    return this.billIssuingUOW.runInTransaction(async (ctx) => {
      const credits = ctx.getCreditRepository();

      // 1. Conditional debit (takes the CreditBalance row lock, serializing bills per company).
      const balanceAfter = await credits.tryConsume(order.companyId, CREDITS_PER_BILL, OVERDRAFT_FLOOR);
      if (balanceAfter === null) {
        const balance = await credits.getBalance(order.companyId);
        if (balance === null) console.error(`OrdersService: company ${order.companyId} has no CreditBalance row`);
        throw new InsufficientCreditsError({ balance: balance ?? 0, overdraftFloor: OVERDRAFT_FLOOR, required: CREDITS_PER_BILL });
      }

      // 2. The bill itself.
      const created = await ctx.getOrderRepository().create(order);

      // 3. Ledger entry linked to the bill.
      await credits.recordBillIssued({ companyId: order.companyId, billId: created.id, amount: CREDITS_PER_BILL, balanceAfter });

      return created;
    });
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