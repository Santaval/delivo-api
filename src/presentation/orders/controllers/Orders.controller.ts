import { IOrdersService } from "@/application/orders/services/interfaces/IOrdersService";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";
import OrderDtoMapper from "../mappers/OrderMapper";
import AddOrderItemRequest from "../requests/AddOrderItem";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import IOrderPaymentsService from "@/application/orders/services/interfaces/IOrderPaymentsService";
import AddPaymentRequest from "../requests/AddPayment";
import PaymentMapper from "../mappers/PaymentMapper";
import IOrderItemsManager from "@/application/orders/services/interfaces/IOrderItemsManager";
import billsQuerySchema from "../validators/billsQuery";
import BillsPageResponse from "../responses/BillsPageResponse";

export default class OrdersController {
  constructor(
    private readonly ordersService: IOrdersService,
    private readonly orderPaymentsService: IOrderPaymentsService,
    private readonly orderItemsManager: IOrderItemsManager
  ) {}

  async ordersByCompany(req: Request, res: Response): Promise<void> {
    const companyId = CompanyIdParser(req);
    const orders = await this.ordersService.openedByCompany(companyId);
    res.json(orders.map(OrderDtoMapper.toResponse));
  }

  async billsByCompany(req: Request, res: Response): Promise<void> {
    const companyId = CompanyIdParser(req);

    // Legacy shape (bare array, no pagination) for app builds that predate pagination.
    // Remove once those builds are no longer supported.
    if (req.query.page === undefined) {
      const orders = await this.ordersService.closedByCompany(companyId);
      res.json(orders.map(OrderDtoMapper.toResponse));
      return;
    }

    const parsed = billsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message });
      return;
    }
    const { page, pageSize, status, search } = parsed.data;

    const result = await this.ordersService.paginatedBills(
      { companyId, status, search: search || undefined },
      { page, pageSize },
    );

    const totalPages = Math.ceil(result.total / result.pageSize);
    const response: BillsPageResponse = {
      data: result.items.map(OrderDtoMapper.toResponse),
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages,
        hasNextPage: result.page < totalPages,
      },
      counts: {
        ALL: result.counts.PENDING + result.counts.PAID + result.counts.CANCELLED,
        ...result.counts,
      },
    };
    res.json(response);
  }

  async create(req: Request, res: Response): Promise<void> {
    const companyId = CompanyIdParser(req);
    const newOrder = OrderDtoMapper.fromCreateToDomain(req.body, companyId);
    const order = await this.ordersService.create(newOrder);
    res.status(201).json(OrderDtoMapper.toResponse(order));
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const order = await this.ordersService.findById(id);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(OrderDtoMapper.toResponse(order));
  }

  async addItem(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const request: AddOrderItemRequest = req.body;
    const order = await this.orderItemsManager.addItem(request.productId, request.quantity, id);
    res.status(201).json(OrderDtoMapper.toResponse(order));
  }

  async markAsDelivered(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const order = await this.ordersService.markAsDelivered(id);
    res.status(200).json(OrderDtoMapper.toResponse(order));
  }

  async removeItem(req: Request, res: Response): Promise<void> {
    const { id, itemId } = req.params;
    const order = await this.orderItemsManager.removeItem(id, itemId);
    res.status(200).json(OrderDtoMapper.toResponse(order));
  }

  async byClient(req: Request, res: Response): Promise<void> {
    const clientId = ClientId.create(req.params.clientId);
    const orders = await this.ordersService.byClient(clientId);
    res.json(orders.map(OrderDtoMapper.toResponse));
  }

  async byClientBilled(req: Request, res: Response): Promise<void> {
    const clientId = ClientId.create(req.params.clientId);
    const orders = await this.ordersService.byClientBilled(clientId);
    res.json(orders.map(OrderDtoMapper.toResponse));
  }

  async addPayment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const paymentData: AddPaymentRequest = req.body;
    const paymentEntity = PaymentMapper.fromAddToDomain(paymentData, id);
    const payment = await this.orderPaymentsService.add(paymentEntity);
    res.status(201).json(PaymentMapper.toResponse(payment));
  }

}