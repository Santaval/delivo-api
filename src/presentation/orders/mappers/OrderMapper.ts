import { Order } from "@/domain/orders";
import OrderResponse from "../responses/OrderResponse";
import ClientDtoMapper from "@/presentation/clients/mappers/Client.mapper";
import OrderItemMapper from "./OrderItemMapper";

export default class OrderResponseMapper {
  static toResponse(order: Order): OrderResponse {
    return {
      id: order.id,
      client: ClientDtoMapper.toResponse(order.client),
      number: order.number,
      pricing: {
        subtotal: order.subtotal,
        ivaTotal: order.ivaTotal,
        total: order.total,
      },
      items: order.items.map(OrderItemMapper.toResponse),
      // @ts-expect-error
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }
}
