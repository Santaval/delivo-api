import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import PaymentMethod from "@/domain/orders/entities/PaymentMethod";

export default interface IPaymentMethodsService {
  getAllByCompany(companyId: CompanyId): Promise<PaymentMethod[]>;
}