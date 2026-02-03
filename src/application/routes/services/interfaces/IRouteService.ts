import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Route, RouteId, RoutePoint, RoutePointId } from "@/domain/routes";

export default interface IRouteService {
  findAllByCompany(companyId: CompanyId): Promise<Route[]>;
  create(route: Route): Promise<Route>;
  findById(id: RouteId): Promise<Route | null>;
  delete(id: RouteId): Promise<void>;
  update(route: Route): Promise<Route>;
  addPoint(point: RoutePoint): Promise<RoutePoint>;
  removePoint(pointId: RoutePointId): Promise<void>
}