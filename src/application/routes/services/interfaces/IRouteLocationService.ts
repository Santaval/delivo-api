import { Route } from "@/domain/routes";
import { LocationEvent } from "@/domain/routes/providers/ILocationBroadcaster";
import { DriverLocation } from "@/domain/routes/valueObjects/driverLocation.valueObject";

export default interface IRouteLocationService {
  /**
   * Report the driver's position. Only the most recent point of the batch is considered.
   * Stale (out-of-order) and throttled points are silently ignored.
   * @throws RouteNotFoundError (404), NotRouteDriverError (403), RouteNotStartedError (409)
   */
  report(routeId: string, userId: string, points: DriverLocation[]): Promise<void>;
  /** Latest known location, or null. Same read permissions as `authorizeRead`. */
  getLatest(routeId: string, userId: string): Promise<DriverLocation | null>;
  /**
   * Allowed readers: the route's driver and OWNER/ADMIN members of the route's company.
   * @returns the route (the stream needs its status)
   * @throws RouteNotFoundError (404), NotAllowedToReadLocationError (403)
   */
  authorizeRead(routeId: string, userId: string): Promise<Route>;
  /**
   * Subscribe to live events of a route. Callers MUST `authorizeRead` first.
   * @returns a function that removes the subscription
   */
  subscribe(routeId: string, callback: (event: LocationEvent) => void): () => void;
  /**
   * Resolves (with a single membership lookup) whether `userId` may see the driver location of
   * routes of `companyId`: OWNER/ADMIN members see all of them, anyone else only their own.
   */
  getLocationVisibility(companyId: string, userId: string): Promise<(route: Route) => boolean>;
}
