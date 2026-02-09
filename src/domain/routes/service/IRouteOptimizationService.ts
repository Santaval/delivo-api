import { Location } from "@/domain/clients/valueObjects/location.valouObject";
import { RouteId } from "../valueObjects/routeId.valueObject";

export default interface IRouteOptimizationService {
  optimize(routeId: RouteId, startLocation: Location): Promise<void>;
}