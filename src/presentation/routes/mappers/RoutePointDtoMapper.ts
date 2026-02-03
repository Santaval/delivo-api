import { RoutePoint } from "@/domain/routes";
import RoutePointResponse from "../responses/RoutePointResponse";
import OrdersDtoMapper from "@/presentation/orders/mappers/OrderMapper";

export default class RoutePointDtoMapper {
  static toResponse(dto: RoutePoint): RoutePointResponse {
    return {
      id: dto.id,
      status: dto.status,
      order: OrdersDtoMapper.toResponse(dto.order),
      routeId: dto.routeId,
      createdAt: dto.createdAt.toISOString(),
      updatedAt: dto.updatedAt.toISOString(),
    };
  }
}
