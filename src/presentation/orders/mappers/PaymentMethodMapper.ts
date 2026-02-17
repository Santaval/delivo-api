import PaymentMethod from "@/domain/orders/entities/PaymentMethod";
import PaymentMethodResponse from "../responses/PaymentMethodResponse";

export default class PaymentMethodDtoMapper {
  static toResponse(domain: PaymentMethod): PaymentMethodResponse {
    return {
      id: domain.id,
      name: domain.name,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    }
  }
}