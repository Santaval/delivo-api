import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Route } from "../entities/Route";
import { RoutePoint } from "../entities/RoutePoint";
import { RouteId } from "../valueObjects/routeId.valueObject";
import { RoutePointId } from "../valueObjects/routePointId.valueObject";

export default interface IRouteRepository {
  create(route: Route): Promise<Route>;
  findById(id: RouteId): Promise<Route | null>;
  findAllByCompany(companyId: CompanyId): Promise<Route[]>;
  update(route: Route): Promise<Route>;
  delete(id: RouteId): Promise<void>;
  addPoint(point: RoutePoint): Promise<RoutePoint>;
  removePoint(pointId: RoutePointId): Promise<void>;
  updatePoint(point: RoutePoint): Promise<RoutePoint>;
}
