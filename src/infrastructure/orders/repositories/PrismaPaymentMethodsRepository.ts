import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import PaymentMethod from "@/domain/orders/entities/PaymentMethod";
import IPaymentMethodRepository from "@/domain/orders/repositories/IPaymentMethodRepository";
import { prisma } from "@/infrastructure/prisma/client";
import PrismaPaymentMethodMapper from "../mappers/PrismaPaymentMethodMapper";

export default class PrismaPaymentMethodsRepository implements IPaymentMethodRepository {
  async allByCompany(companyId: CompanyId): Promise<PaymentMethod[]> {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        companyId: companyId.value
      }
    });
    return paymentMethods.map(PrismaPaymentMethodMapper.toDomain);
  }

  async create(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    const createdPaymentMethod = await prisma.paymentMethod.create(PrismaPaymentMethodMapper.toPersistenceCreate(paymentMethod));
    return PrismaPaymentMethodMapper.toDomain(createdPaymentMethod);
  }

  async update(paymentMethod: PaymentMethod): Promise<PaymentMethod> {
    const updatedPaymentMethod = await prisma.paymentMethod.update(
      PrismaPaymentMethodMapper.toPersistenceUpdate(paymentMethod)
    );
    return PrismaPaymentMethodMapper.toDomain(updatedPaymentMethod);
  }

  async delete(paymentMethodId: string): Promise<void> {
    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId }
    });
  }
}
