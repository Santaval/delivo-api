import IPaymentMethodsService from "@/application/orders/services/interfaces/IPaymentMethodsService";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";
import PaymentMethodDtoMapper from "../mappers/PaymentMethodMapper";

export default class PaymentMethodsController {
  constructor(private paymentMethodsService: IPaymentMethodsService) {}

  async getAllByCompany(req: Request, res: Response) {
    const companyId = CompanyIdParser(req);
    const paymentMethods = await this.paymentMethodsService.getAllByCompany(CompanyId.create(companyId));
    const response = paymentMethods.map(PaymentMethodDtoMapper.toResponse);
    return res.json(response);
  }
}
