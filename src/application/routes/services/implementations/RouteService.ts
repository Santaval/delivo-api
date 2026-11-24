import IRouteRepository, { RouteFilters } from "@/domain/routes/repositories/IRouteRepository";
import IRouteService from "../interfaces/IRouteService";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { Route, RouteId, RoutePoint, RoutePointId } from "@/domain/routes";
import IRouteOptimizationService from "@/domain/routes/service/IRouteOptimizationService";
import { Location } from "@/domain/clients/valueObjects/location.valouObject";
import IOrderDeliveryStatusManager from "@/domain/orders/services/IOrderDeliveryStatusManager";
import ApplicationError from "@/application/core/errors/ApplicationError";
import { ICompanyMemberRepository } from "@/domain/companies/repositories/ICompanyMemberRepository";
import { RouteNotFoundError } from "../../errors/RouteNotFoundError";
import { InvalidRouteDriverError } from "../../errors/InvalidRouteDriverError";
import { ILocationBroadcaster } from "@/domain/routes/providers/ILocationBroadcaster";
import { RouteAlreadyCompletedError } from "../../errors/RouteAlreadyCompletedError";

const DRIVER_ROLES = ["DEALER", "ADMIN", "OWNER"];

export default class RouteService implements IRouteService {
  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly routeOptimizationService: IRouteOptimizationService,
    private readonly orderDeliveryStatusManager: IOrderDeliveryStatusManager,
    private readonly companyMemberRepository: ICompanyMemberRepository,
    private readonly locationBroadcaster: ILocationBroadcaster
  ) {}

  findAllByCompany(companyId: CompanyId, filters?: RouteFilters): Promise<Route[]> {
    return this.routeRepository.findAllByCompany(companyId, filters);
  }

  /**
   * The driver must be a member of the company with a role that can deliver.
   * @throws InvalidRouteDriverError (422)
   */
  private async validateDriver(driverId: string, companyId: string): Promise<void> {
    const membership = await this.companyMemberRepository.findMembership(driverId, companyId);
    if (!membership || !DRIVER_ROLES.includes(membership.role)) {
      throw new InvalidRouteDriverError();
    }
  }

  async create(route: Route): Promise<Route> {
    if (route.driverId) await this.validateDriver(route.driverId, route.companyId);
    const created = await this.routeRepository.create(route);
    // re-read so the `driver` read-model is populated
    return (await this.routeRepository.findById(RouteId.create(created.id))) ?? created;
  }

  async assignDriver(routeId: RouteId, driverId: string | null, companyId: string): Promise<Route> {
    const route = await this.routeRepository.findById(routeId);
    if (!route || route.companyId !== companyId) throw new RouteNotFoundError();
    if (route.status === "COMPLETED") throw new RouteAlreadyCompletedError();
    if (driverId) await this.validateDriver(driverId, companyId);

    const driverChanged = route.driverId !== driverId;
    route.assignDriver(driverId);
    await this.routeRepository.update(route);
    if (driverChanged) {
      // privacy: the previous driver's position must not outlive the assignment
      await this.routeRepository.deleteDriverLocation(route.id);
      this.locationBroadcaster.publish(route.id, { type: "cleared" });
    }
    return (await this.routeRepository.findById(routeId)) ?? route;
  }

  update(route: Route): Promise<Route> {
    return this.routeRepository.update(route);
  }

  delete(id: RouteId): Promise<void> {
    return this.routeRepository.delete(id);
  }

  async addPoint(point: RoutePoint): Promise<RoutePoint> {
    const addedPoint = await this.routeRepository.addPoint(point);
    await this.orderDeliveryStatusManager.change(point.order.id, "ON_ROUTE");
    return addedPoint;
  }

  async removePoint(pointId: RoutePointId): Promise<void> {
    await this.routeRepository.removePoint(pointId);
    await this.orderDeliveryStatusManager.change(pointId.value, "PENDING");
  }

  findById(id: RouteId): Promise<Route | null> {
    return this.routeRepository.findById(id);
  }

  async start(routeId: RouteId, startLocation: Location): Promise<Route> {
    const optimizedRoute = await this.routeOptimizationService.optimize(routeId, startLocation);
    optimizedRoute.setStatus("STARTED");
    const updatedRoute = await this.routeRepository.update(optimizedRoute);

    // for each order in the route, change its status to "IN_TRANSIT"
    const promises = updatedRoute.points.map(point => this.orderDeliveryStatusManager.change(point.order.id, "IN_TRANSIT"));

    await Promise.all(promises);
    return updatedRoute;
  }

  async finish(routeId: RouteId): Promise<Route> {
    const route = await this.routeRepository.findById(routeId);
    if (!route) throw new Error("Route not found");
    route.setStatus("COMPLETED");

    // mark all orders of skipped points as pending
    const skippedPoints = route.points.filter(point => point.status === "SKIPPED");
    const promises = skippedPoints.map(point => this.orderDeliveryStatusManager.change(point.order.id, "PENDING"));
    await Promise.all(promises);
    const updated = await this.routeRepository.update(route);

    // privacy: drop the live location and tell the SSE clients to close
    await this.routeRepository.deleteDriverLocation(route.id);
    this.locationBroadcaster.publish(route.id, { type: "finished" });
    return updated;
  }

  async completeDelivery(routePointId: RoutePointId): Promise<RoutePoint> {
    const routePoint = await this.routeRepository.findPointById(routePointId);
    if (!routePoint) throw new Error("Route point not found");
    routePoint.setStatus("VISITED");
    const updatedRoutePoint = await this.routeRepository.updatePoint(routePoint);
    // change order status to "DELIVERED"
    await this.orderDeliveryStatusManager.change(updatedRoutePoint.order.id, "DELIVERED");
    await this.tryMarkAsFinished(RouteId.create(updatedRoutePoint.routeId));
    return updatedRoutePoint;
  }

  async skipDelivery(routePointId: RoutePointId): Promise<void> {
    const routePoint = await this.routeRepository.findPointById(routePointId);
    if (!routePoint) throw new Error("Route point not found");
    routePoint.setStatus("SKIPPED");
    await this.routeRepository.updatePoint(routePoint);
  }

  async markAsFinished(routeId: RouteId): Promise<Route> {
    const route = await this.routeRepository.findById(routeId);
    if (!route) throw new Error("Route not found");
    const arePointsFinished = route.points.every(point => point.status !== "CREATED");
    if (!arePointsFinished) throw new ApplicationError("Not all points are finished");
    return this.finish(routeId);
  }

  async tryMarkAsFinished(routeId: RouteId): Promise<Route | null> {
    try {
      return await this.markAsFinished(routeId);
    } catch (error) {
      if (error instanceof ApplicationError) {
        // Handle specific application error
        console.error("Application error occurred:", error.message);
      } else {
        // Handle generic error
        console.error("An error occurred:", error);
      }
      return null;
    }
  }
}