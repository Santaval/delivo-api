import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import PaymentMethod from "../entities/PaymentMethod";

export default interface IPaymentMethodRepository {
  allByCompany(companyId: CompanyId): Promise<PaymentMethod[]>;
}