import { Coordinate } from "../valueObjects/Coordinate.valueObject";
import LocationDescription from "../valueObjects/LocationDescription.valueObject";

export default class Location {
  private props : LocationProps;

  constructor(id: string, description: string, latitude: number, longitude: number, placeId: string) {
    this.props = {
      id,
      description: LocationDescription.create(description),
      coordinate: Coordinate.create(latitude, longitude),
      placeId
    };
  }

  get id() { return this.props.id; }
  get coordinate() { return this.props.coordinate; }
  get placeId() { return this.props.placeId; }
  get description() { return this.props.description; }

}


interface LocationProps {
  id: string;
  description: LocationDescription;
  coordinate: Coordinate;
  placeId: string;
}
