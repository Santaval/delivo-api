import DataException from "@/domain/core/errors/DataError";

export class Location {
  private readonly _lat: number | null
  private readonly _lng: number | null
  private constructor(lat: number | null, lng: number | null) {
    this._lat = lat
    this._lng = lng
  }

  static create(lat: number | null, lng: number | null) {
    if (lat !== null && (lat < -90 || lat > 90)) {
      throw new DataException("Invalid latitude");
    }
    if (lng !== null && (lng < -180 || lng > 180)) {
      throw new DataException("Invalid longitude");
    }
    return new Location(lat, lng);
  }

  get lat() {
    return this._lat;
  }

  get lng() {
    return this._lng;
  }
}
