import IPaymentMethodRepository from "@/domain/orders/repositories/IPaymentMethodRepository";
import IPaymentMethodsService from "../interfaces/IPaymentMethodsService";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import PaymentMethod from "@/domain/orders/entities/PaymentMethod";

export default class PaymentMethodsService implements IPaymentMethodsService {
  constructor(private paymentMethodsRepository: IPaymentMethodRepository) {}

  async getAllByCompany(companyId: CompanyId): Promise<PaymentMethod[]> {
    return this.paymentMethodsRepository.allByCompany(companyId);
  }
}
