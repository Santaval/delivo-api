import { Route } from "@/domain/routes";
import RouteResponse from "../responses/RouteResponse";
import RoutePointDtoMapper from "./RoutePointDtoMapper";
import CreateRouteRequest from "../requests/CreateRouteRequest";

export default class RouteDtoMapper {
  static toResponse(dto: Route): RouteResponse {
    return {
      id: dto.id,
      name: dto.name,
      status: dto.status,
      companyId: dto.companyId,
      points: dto.points?.map(RoutePointDtoMapper.toResponse),
      createdAt: dto.createdAt.toISOString(),
      updatedAt: dto.updatedAt.toISOString(),
    };
  }

  static fromCreateToDomain(dto: CreateRouteRequest, companyId: string): Route {
    return new Route({
      name: dto.name,
      status: "CREATED",
      companyId: companyId,
      polyline: null,
      points: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: "to-be-generated-id"
    });
  }
}
