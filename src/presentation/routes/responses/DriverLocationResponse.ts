/** Full location payload (GET /routes/:id/location and the SSE `location` event). */
export default interface DriverLocationResponse {
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  accuracy: number | null;
  /** ISO-8601 */
  recordedAt: string;
}

/** Reduced payload embedded in RouteResponse. */
export type RouteDriverLocationResponse = Pick<DriverLocationResponse, "lat" | "lng" | "heading" | "recordedAt">;
