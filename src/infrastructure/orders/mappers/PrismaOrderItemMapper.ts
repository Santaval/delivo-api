import { OrderItem } from "@/domain/orders";
import { ClientBillItemCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export default class PrismaOrderItemMapper {
  static toDomain(raw: any): OrderItem {
    return new OrderItem({
      id: raw.productId,
      billId: raw.billId,
      quantity: Number(raw.quantity),
      grossPrice: raw.unitGrossPrice.toNumber(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      name: raw.product.name,
      companyId: raw.product.companyId,
      ivaRate: raw.ivaRate.toNumber(),
      itemId: raw.id
    });
  }

  static toPrisma(orderItem: OrderItem): ClientBillItemCreateArgs {
    return {
      data: {
        productId: orderItem.id,
        billId: orderItem.billId,
        quantity: orderItem.quantity,
        ivaRate: orderItem.pricing.ivaRate,
        unitGrossPrice: orderItem.pricing.grossPrice,
      },
    }
  }
}
