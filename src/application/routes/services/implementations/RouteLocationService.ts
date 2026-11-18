import IRouteRepository from "@/domain/routes/repositories/IRouteRepository";
import { ICompanyMemberRepository } from "@/domain/companies/repositories/ICompanyMemberRepository";
import { ILocationBroadcaster, LocationEvent } from "@/domain/routes/providers/ILocationBroadcaster";
import { Route, RouteId } from "@/domain/routes";
import { DriverLocation } from "@/domain/routes/valueObjects/driverLocation.valueObject";
import IRouteLocationService from "../interfaces/IRouteLocationService";
import { RouteNotFoundError } from "../../errors/RouteNotFoundError";
import { NotRouteDriverError } from "../../errors/NotRouteDriverError";
import { RouteNotStartedError } from "../../errors/RouteNotStartedError";
import { NotAllowedToReadLocationError } from "../../errors/NotAllowedToReadLocationError";

/** Minimum time between two accepted points of the same route. */
export const LOCATION_THROTTLE_MS = 3000;

const READER_ROLES = ["OWNER", "ADMIN"];

export default class RouteLocationService implements IRouteLocationService {
  /** routeId -> server time (ms) of the last accepted point. Per-process, like the broadcaster. */
  private readonly lastAcceptedAt = new Map<string, number>();

  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly companyMemberRepository: ICompanyMemberRepository,
    private readonly broadcaster: ILocationBroadcaster,
  ) {}

  async report(routeId: string, userId: string, points: DriverLocation[]): Promise<void> {
    const route = await this.routeRepository.findById(RouteId.create(routeId));
    if (!route) throw new RouteNotFoundError();
    if (route.driverId !== userId) throw new NotRouteDriverError();
    if (route.status !== "STARTED") throw new RouteNotStartedError();

    if (points.length === 0) return;
    const latest = points.reduce((a, b) => (b.recordedAt.getTime() > a.recordedAt.getTime() ? b : a));

    // retries can arrive out of order: never go back in time
    const stored = await this.routeRepository.findDriverLocation(routeId);
    if (stored && stored.recordedAt.getTime() >= latest.recordedAt.getTime()) return;

    const now = Date.now();
    this.evictExpired(now);
    const last = this.lastAcceptedAt.get(routeId);
    if (last !== undefined && now - last < LOCATION_THROTTLE_MS) return;
    // reserve the slot before awaiting so concurrent requests are throttled too
    this.lastAcceptedAt.set(routeId, now);

    try {
      await this.routeRepository.upsertDriverLocation(routeId, userId, latest);
    } catch (error) {
      this.lastAcceptedAt.delete(routeId);
      throw error;
    }
    this.broadcaster.publish(routeId, { type: "location", location: latest });
  }

  async getLatest(routeId: string, userId: string): Promise<DriverLocation | null> {
    await this.authorizeRead(routeId, userId);
    return this.routeRepository.findDriverLocation(routeId);
  }

  async authorizeRead(routeId: string, userId: string): Promise<Route> {
    const route = await this.routeRepository.findById(RouteId.create(routeId));
    if (!route) throw new RouteNotFoundError();
    if (route.driverId === userId) return route;

    const membership = await this.companyMemberRepository.findMembership(userId, route.companyId);
    if (!membership || !READER_ROLES.includes(membership.role)) {
      throw new NotAllowedToReadLocationError();
    }
    return route;
  }

  subscribe(routeId: string, callback: (event: LocationEvent) => void): () => void {
    return this.broadcaster.subscribe(routeId, callback);
  }

  async getLocationVisibility(companyId: string, userId: string): Promise<(route: Route) => boolean> {
    const membership = await this.companyMemberRepository.findMembership(userId, companyId);
    const isManager = !!membership && READER_ROLES.includes(membership.role);
    return (route) => route.driverId === userId || (isManager && route.companyId === companyId);
  }

  private evictExpired(now: number): void {
    for (const [id, at] of this.lastAcceptedAt) {
      if (now - at >= LOCATION_THROTTLE_MS) this.lastAcceptedAt.delete(id);
    }
  }
}
