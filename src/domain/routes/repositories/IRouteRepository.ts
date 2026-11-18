import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Route } from "../entities/Route";
import { RoutePoint } from "../entities/RoutePoint";
import { RouteId } from "../valueObjects/routeId.valueObject";
import { RoutePointId } from "../valueObjects/routePointId.valueObject";
import { DriverLocation } from "../valueObjects/driverLocation.valueObject";

export interface RouteFilters {
  /** Only routes assigned to this user. */
  driverId?: string;
}

export default interface IRouteRepository {
  create(route: Route): Promise<Route>;
  findById(id: RouteId): Promise<Route | null>;
  findAllByCompany(companyId: CompanyId, filters?: RouteFilters): Promise<Route[]>;
  update(route: Route): Promise<Route>;
  delete(id: RouteId): Promise<void>;
  addPoint(point: RoutePoint): Promise<RoutePoint>;
  removePoint(pointId: RoutePointId): Promise<void>;
  updatePoint(point: RoutePoint): Promise<RoutePoint>;
  findPointById(id: RoutePointId): Promise<RoutePoint | null>;
  /**
   * Unassign a user as driver from every route of a company that is not COMPLETED.
   * Used when the user leaves or is removed from the company.
   */
  unassignDriverInCompany(userId: string, companyId: string): Promise<void>;
  /**
   * Unassign a user as driver from every route (any company). Used on account deletion.
   */
  unassignDriverFromAll(userId: string): Promise<void>;
  /** Insert or replace the latest known location of a route's driver. */
  upsertDriverLocation(routeId: string, driverId: string, location: DriverLocation): Promise<void>;
  findDriverLocation(routeId: string): Promise<DriverLocation | null>;
  /** Delete the stored location of a route. Does nothing if there is none. */
  deleteDriverLocation(routeId: string): Promise<void>;
  /**
   * Count routes created by a company within a half-open date range `[start, end)`.
   * @param companyId The ID of the company.
   * @param start Inclusive lower bound of `createdAt`.
   * @param end Exclusive upper bound of `createdAt`.
   * @returns A promise that resolves to the number of matching routes.
   */
  countByCompanyAndCreatedAtRange(companyId: string, start: Date, end: Date): Promise<number>;
}
