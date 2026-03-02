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
    const orders = await this.ordersService.closedByCompany(companyId);
    res.json(orders.map(OrderDtoMapper.toResponse));
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

  async addPayment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const paymentData: AddPaymentRequest = req.body;
    const paymentEntity = PaymentMapper.fromAddToDomain(paymentData, id);
    const payment = await this.orderPaymentsService.add(paymentEntity);
    res.status(201).json(PaymentMapper.toResponse(payment));
  }

}