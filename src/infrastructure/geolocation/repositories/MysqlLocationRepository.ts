import Location from "@/domain/geolocation/entities/Location";
import { ILocationRepository } from "@/domain/geolocation/repositories/ILocationRepository";
import MysqlUnitOfWork from "@/infrastructure/core/services/MysqlUnitOfWork";

export default class MysqlLocationRepository extends MysqlUnitOfWork implements ILocationRepository {
  constructor() {
    super();
  }

  /**
   *  Creates a new location in the database.
   * @param location  The location object containing the location's details.
   * @returns A promise that resolves to the created location.
   */
  async create(id: string, location: Location): Promise<Location> {
    const keys = ["id", "description", "latitude", "longitude", "placeId"];
    const values = [
      id,
      location.description.value,
      location.coordinate.latitude,
      location.coordinate.longitude,
      location.placeId
    ];
    await this.insert(keys, values, "locations");
    return location;
  }

  async find(id: string): Promise<Location | null> {
    const result = await super.find("locations", "id", id);
    if (!result) return null;
    return this.toEntity(result);
  }
  
  async all(): Promise<Location[]> {
    const results = await super.select("*", "locations");
    return results.map(this.toEntity);
  }
  
  toEntity(data: any): Location {
    return new Location(
      data.id,
      data.description,
      data.latitude,
      data.longitude,
      data.placeId
    );
  }

}