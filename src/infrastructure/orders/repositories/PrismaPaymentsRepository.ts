import Payment from "@/domain/orders/entities/Payment";
import IPaymentRepository from "@/domain/orders/repositories/IPaymentRepository";
import PrismaPaymentMapper from "../mappers/PrismaPaymentMapper";
import { prisma } from "@/infrastructure/prisma/client";
import { PaymentId } from "@/domain/orders/valueObjects/paymentId.valueObject";

export default class PrismaPaymentsRepository implements IPaymentRepository {
  async add(payment: Payment): Promise<Payment> {
    const raw = PrismaPaymentMapper.toPersistence(payment);
    const result = await prisma.clientPayment.create(raw);
    console.log(result);
    // @ts-ignore
    return PrismaPaymentMapper.toDomain(result);
  }

  async delete(paymentId: PaymentId): Promise<void> {
    await prisma.clientPayment.delete({
      where: {
        id: paymentId.value
      }
    });
  }
}