import { OrderItem } from "@/domain/orders";
import OrderItemResponse from "../responses/OrderItemResponse";

export default class OrderItemMapper {
  static toResponse(item: OrderItem): OrderItemResponse {
    return {
      id: item.itemId,
      name: item.name,
      pricing: {
        netPrice: item.pricing.netPrice,
        ivaRate: item.pricing.ivaRate,
        ivaAmount: item.pricing.ivaAmount,
        totalPrice: item.pricing.totalPrice,
      },
      quantity: item.quantity,
      productId: item.id,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
