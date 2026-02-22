import IPaymentMethodsService from "@/application/orders/services/interfaces/IPaymentMethodsService";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";
import PaymentMethodDtoMapper from "../mappers/PaymentMethodMapper";
import CreatePaymentMethodRequest from "../requests/CreatePaymentMethod";

export default class PaymentMethodsController {
  constructor(private paymentMethodsService: IPaymentMethodsService) {}

  async getAllByCompany(req: Request, res: Response) {
    const companyId = CompanyIdParser(req);
    const paymentMethods = await this.paymentMethodsService.getAllByCompany(CompanyId.create(companyId));
    const response = paymentMethods.map(PaymentMethodDtoMapper.toResponse);
    return res.json(response);
  }

  async create(req: Request, res: Response) {
    const paymentMethodData: CreatePaymentMethodRequest = req.body;
    const paymentMethodEntity = PaymentMethodDtoMapper.fromCreateToDomain(paymentMethodData, CompanyIdParser(req));
    console.log(paymentMethodEntity);
    const paymentMethod = await this.paymentMethodsService.create(paymentMethodEntity);
    return res.status(201).json(PaymentMethodDtoMapper.toResponse(paymentMethod));
  }
}
