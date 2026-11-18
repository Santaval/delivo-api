import DataError from "@/domain/core/errors/DataError";

/** Max clock skew tolerated between the device and the server. */
const MAX_FUTURE_SKEW_MS = 5 * 60 * 1000;

export interface DriverLocationProps {
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  recordedAt: Date;
}

/** Position reported by the device of a route's driver. */
export class DriverLocation {
  private constructor(
    public readonly lat: number,
    public readonly lng: number,
    public readonly heading: number | null,
    public readonly speed: number | null,
    public readonly accuracy: number | null,
    public readonly recordedAt: Date,
  ) {}

  static create(props: DriverLocationProps): DriverLocation {
    const { lat, lng, recordedAt } = props;
    const heading = props.heading ?? null;
    const speed = props.speed ?? null;
    const accuracy = props.accuracy ?? null;

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      throw new DataError("Latitude must be between -90 and 90 degrees.");
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      throw new DataError("Longitude must be between -180 and 180 degrees.");
    }
    if (heading !== null && (!Number.isFinite(heading) || heading < 0 || heading > 360)) {
      throw new DataError("Heading must be between 0 and 360 degrees.");
    }
    if (speed !== null && (!Number.isFinite(speed) || speed < 0)) {
      throw new DataError("Speed cannot be negative.");
    }
    if (accuracy !== null && (!Number.isFinite(accuracy) || accuracy < 0)) {
      throw new DataError("Accuracy cannot be negative.");
    }
    if (!(recordedAt instanceof Date) || Number.isNaN(recordedAt.getTime())) {
      throw new DataError("recordedAt must be a valid date.");
    }
    if (recordedAt.getTime() > Date.now() + MAX_FUTURE_SKEW_MS) {
      throw new DataError("recordedAt cannot be in the future.");
    }

    return new DriverLocation(lat, lng, heading, speed, accuracy, new Date(recordedAt));
  }
}
