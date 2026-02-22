import PaymentMethod from "@/domain/orders/entities/PaymentMethod";
import { PaymentMethod as PrismaPaymentMethod } from "@/infrastructure/prisma/generated/prisma/client";
import { PaymentMethodCreateArgs, PaymentMethodUpdateArgs } from "@/infrastructure/prisma/generated/prisma/models";

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

  static toPersistenceCreate(paymentMethod: PaymentMethod): PaymentMethodCreateArgs {
    return {
      data: {
        name: paymentMethod.name,
        companyId: paymentMethod.companyId,
      }
    }
  }

  static toPersistenceUpdate(paymentMethod: PaymentMethod): PaymentMethodUpdateArgs {
    return {
      where: { id: paymentMethod.id },
      data: {
        name: paymentMethod.name,
        companyId: paymentMethod.companyId,
        createdAt: paymentMethod.createdAt,
        updatedAt: paymentMethod.updatedAt
      }
    }
  }
}