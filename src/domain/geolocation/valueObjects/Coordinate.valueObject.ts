import DataError from "@/domain/core/errors/DataError";

class Coordinate {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) { }

  static create(latitude: number, longitude: number) {
    if (latitude < -90 || latitude > 90) {
      throw new DataError("Latitude must be between -90 and 90 degrees.");
    }
    if (longitude < -180 || longitude > 180) {
      throw new DataError("Longitude must be between -180 and 180 degrees.");
    }
    return new Coordinate(latitude, longitude);
  }

  get value() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
export { Coordinate };