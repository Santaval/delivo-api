import { Location } from "@/domain/clients/valueObjects/location.valouObject";
import { RouteId } from "../valueObjects/routeId.valueObject";
import { Route } from "../entities/Route";

export default interface IRouteOptimizationService {
  optimize(routeId: RouteId, startLocation: Location): Promise<Route>;
}