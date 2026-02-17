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
}
