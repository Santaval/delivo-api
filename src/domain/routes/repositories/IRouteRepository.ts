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
  findPointById(id: RoutePointId): Promise<RoutePoint | null>;
  /**
   * Count routes created by a company within a half-open date range `[start, end)`.
   * @param companyId The ID of the company.
   * @param start Inclusive lower bound of `createdAt`.
   * @param end Exclusive upper bound of `createdAt`.
   * @returns A promise that resolves to the number of matching routes.
   */
  countByCompanyAndCreatedAtRange(companyId: string, start: Date, end: Date): Promise<number>;
}
