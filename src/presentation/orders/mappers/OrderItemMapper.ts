import { OrderItem } from "@/domain/orders";
import OrderItemResponse from "../responses/OrderItemResponse";
import AddOrderItemRequest from "../requests/AddOrderItem";

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

  static fromAddItemRequest(req: AddOrderItemRequest, orderId: string): OrderItem {
    const { productId, quantity } = req;
    const item = new OrderItem({
      name: "to-be-filled",
      billId: orderId,
      quantity,
      id: productId,
      companyId: "to-be-filled",
      createdAt: new Date().toISOString(),
      grossPrice: 0,
      itemId: "to-be-filled",
      updatedAt: new Date().toISOString(),
    });
    return item;
  }
}
