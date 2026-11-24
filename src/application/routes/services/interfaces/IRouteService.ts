import { Location } from "@/domain/clients/valueObjects/location.valouObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { RouteFilters } from "@/domain/routes/repositories/IRouteRepository";
import { Route, RouteId, RoutePoint, RoutePointId } from "@/domain/routes";

export default interface IRouteService {
  findAllByCompany(companyId: CompanyId, filters?: RouteFilters): Promise<Route[]>;
  create(route: Route): Promise<Route>;
  findById(id: RouteId): Promise<Route | null>;
  delete(id: RouteId): Promise<void>;
  update(route: Route): Promise<Route>;
  assignDriver(routeId: RouteId, driverId: string | null, companyId: string): Promise<Route>;
  addPoint(point: RoutePoint): Promise<RoutePoint>;
  removePoint(pointId: RoutePointId): Promise<void>;
  start(routeId: RouteId, startLocation: Location): Promise<Route>;
  completeDelivery(routePointId: RoutePointId): Promise<RoutePoint>;
}