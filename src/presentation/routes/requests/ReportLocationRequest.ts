export interface LocationPointRequest {
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  /** ISO-8601 string or epoch milliseconds */
  recordedAt: string | number;
}

export default interface ReportLocationRequest {
  locations: LocationPointRequest[];
}
