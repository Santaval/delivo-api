import { Route } from "@/domain/routes";
import RouteResponse from "../responses/RouteResponse";
import RoutePointDtoMapper from "./RoutePointDtoMapper";
import CreateRouteRequest from "../requests/CreateRouteRequest";

export default class RouteDtoMapper {
  /**
   * @param includeLocation whether the caller may see the driver's location
   *   (see IRouteLocationService.getLocationVisibility). Defaults to false (privacy).
   */
  static toResponse(dto: Route, includeLocation: boolean = false): RouteResponse {
    return {
      id: dto.id,
      name: dto.name,
      status: dto.status,
      companyId: dto.companyId,
      polyline: dto.polyline,
      driverId: dto.driverId,
      driver: dto.driver
        ? { id: dto.driver.id, name: dto.driver.name, surnames: dto.driver.surnames }
        : null,
      driverLocation:
        includeLocation && dto.driverLocation
          ? {
              lat: dto.driverLocation.lat,
              lng: dto.driverLocation.lng,
              heading: dto.driverLocation.heading,
              recordedAt: dto.driverLocation.recordedAt.toISOString(),
            }
          : null,
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
      driverId: dto.driverId ?? null,
      points: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: "to-be-generated-id"
    });
  }
}
