import { Order } from "@/domain/orders";
import OrderResponse from "../responses/OrderResponse";
import ClientDtoMapper from "@/presentation/clients/mappers/Client.mapper";
import OrderItemMapper from "./OrderItemMapper";
import CreateOrderRequest from "../requests/CreateOrderRequest";
import { Client } from "@/domain/clients/entities/Client";

export default class OrdersDtoMapper {
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
      deliveryStatus: order.deliveryStatus as "PENDING" | "ON_ROUTE" | "IN_TRANSIT" | "DELIVERED" | "RETURNED",
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  }

  static fromCreateToDomain(request: CreateOrderRequest, companyId: string): Order {
    return new Order({
      id: "to-be-filled",
      client: new Client({
        id: request.clientId,
        name: "to-be-filled",
        companyId: companyId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lat: 0,
        lng: 0
      }),
      deliveryStatus: "PENDING",
      number: 1, // Temporary hardcoded value
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      companyId: companyId,
      ivaTotal: 0,
      status: "PENDING",
      subtotal: 0,
      total: 0,
      paid: 0
    });
  }

}
