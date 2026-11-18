import { DriverLocation } from "../valueObjects/driverLocation.valueObject";

export type LocationEvent =
  | { type: "location"; location: DriverLocation }
  /** Driver reassigned / unassigned: drop the marker. */
  | { type: "cleared" }
  /** Route completed: close the stream. */
  | { type: "finished" };

/**
 * Pub/sub of live driver locations, keyed by route id.
 * The in-memory implementation only works with a single API instance; swap it for a
 * shared implementation (e.g. Redis) before scaling horizontally.
 */
export interface ILocationBroadcaster {
  publish(routeId: string, event: LocationEvent): void;
  /** @returns a function that removes the subscription */
  subscribe(routeId: string, callback: (event: LocationEvent) => void): () => void;
}
