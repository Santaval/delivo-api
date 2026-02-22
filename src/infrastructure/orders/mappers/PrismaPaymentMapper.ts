import Payment from "@/domain/orders/entities/Payment";
import { ClientPayment, PaymentMethod } from "@/infrastructure/prisma/generated/prisma/client";
import PrismaPaymentMethodMapper from "./PrismaPaymentMethodMapper";
import { ClientPaymentCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export type FullPaymentType =  ClientPayment & {method: PaymentMethod}

export default class PrismaPaymentMapper {

  static toDomain(raw: FullPaymentType): Payment {
    return new Payment({
      id: raw.id,
      amount: raw.amount.toNumber(),
      orderId: raw.billId,
      method: PrismaPaymentMethodMapper.toDomain(raw.method),
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString()
    })
  }

  static toPersistence(domain: Payment): ClientPaymentCreateArgs {
    return {
      data: {
        amount: domain.amount.value,
        methodId: domain.method.id,
        billId: domain.orderId.value
      },
      include: {
        method: true
      }
    }
  }

}