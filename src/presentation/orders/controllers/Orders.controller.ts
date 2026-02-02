import { IOrdersService } from "@/application/orders/services/interfaces/IOrdersService";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";
import OrderDtoMapper from "../mappers/OrderMapper";
import OrderItemMapper from "../mappers/OrderItemMapper";

export default class OrdersController {
  constructor(
    private readonly ordersService: IOrdersService
  ) {}

  async findByCompany(req: Request, res: Response): Promise<void> {
    const companyId = CompanyIdParser(req);
    const orders = await this.ordersService.findByCompany(companyId);
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
    const order = await this.ordersService.addItem(OrderItemMapper.fromAddItemRequest(req.body))
    res.status(201).json(OrderDtoMapper.toResponse(order));
  }

}