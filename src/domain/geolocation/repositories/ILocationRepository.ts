import Location from "../entities/Location";

export interface ILocationRepository {
  create(id: string,location: Location): Promise<Location>;
  find(id: string): Promise<Location | null>;
  all(): Promise<Location[]>;
}