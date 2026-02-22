import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import PaymentMethod from "../entities/PaymentMethod";

export default interface IPaymentMethodRepository {
  allByCompany(companyId: CompanyId): Promise<PaymentMethod[]>;
  create(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
  update(paymentMethod: PaymentMethod): Promise<PaymentMethod>;
  delete(paymentMethodId: string): Promise<void>;
}