import { RoutePoint } from "@/domain/routes";
import RoutePointResponse from "../responses/RoutePointResponse";
import OrdersDtoMapper from "@/presentation/orders/mappers/OrderMapper";
import AddRouteItemRequest from "../requests/AddRouteItemRequest";
import { Order } from "@/domain/orders";
import { Client } from "@/domain/clients/entities/Client";

export default class RoutePointDtoMapper {
  static toResponse(dto: RoutePoint): RoutePointResponse {
    return {
      id: dto.id,
      status: dto.status,
      index: dto.index,
      order: OrdersDtoMapper.toResponse(dto.order),
      routeId: dto.routeId,
      createdAt: dto.createdAt.toISOString(),
      updatedAt: dto.updatedAt.toISOString(),
    };
  }

  static fromAddRequest(req: AddRouteItemRequest, routeId: string): RoutePoint {
    return new RoutePoint({
      id: "to-be-filled",
      index: null,
      polyline: null,
      order: new Order({
        id: req.orderId,
        deliveryStatus: "PENDING",
        client: new Client({
          id: "not-needed",
          name: "not-needed",
          lat: 0,
          lng: 0,
          companyId: "not-needed",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
        companyId: "not-needed",
        
        items: [],
        ivaTotal: 0,
        number: 1,
        status: "PENDING",
        subtotal: 0,
        total: 0,
        paid: 0
      }),
      routeId: routeId,
      status: "CREATED",

    });
  }
}
