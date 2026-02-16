import PaymentMethod from "@/domain/orders/entities/PaymentMethod";
import { PaymentMethod as PrismaPaymentMethod } from "@/infrastructure/prisma/generated/prisma/client";

export default class PrismaPaymentMethodMapper {
  static toDomain(raw: PrismaPaymentMethod): PaymentMethod {
    return new PaymentMethod({
      id: raw.id,
      name: raw.name,
      companyId: raw.companyId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
  }
}