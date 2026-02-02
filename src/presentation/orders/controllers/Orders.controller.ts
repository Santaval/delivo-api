import { IOrdersService } from "@/application/orders/services/interfaces/IOrdersService";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";

export default class OrdersController {
  constructor(
    private readonly ordersService: IOrdersService
  ) {}

  async findByCompany(req: Request, res: Response): Promise<void> {
    const companyId = CompanyIdParser(req);
    const orders = await this.ordersService.findByCompany(companyId);
    res.json(orders);
  }

}
