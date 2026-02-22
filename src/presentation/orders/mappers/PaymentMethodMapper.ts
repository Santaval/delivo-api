import PaymentMethod from "@/domain/orders/entities/PaymentMethod";
import PaymentMethodResponse from "../responses/PaymentMethodResponse";
import CreatePaymentMethodRequest from "../requests/CreatePaymentMethod";

export default class PaymentMethodDtoMapper {
  static toResponse(domain: PaymentMethod): PaymentMethodResponse {
    return {
      id: domain.id,
      name: domain.name,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    }
  }

  static fromCreateToDomain(req: CreatePaymentMethodRequest, companyId: string): PaymentMethod {
    return new PaymentMethod({
      id: "to-be-filled",
      name: req.name,
      companyId: companyId
    })
  }
}