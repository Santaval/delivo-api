import { DriverLocation } from "@/domain/routes/valueObjects/driverLocation.valueObject";
import DriverLocationResponse from "../responses/DriverLocationResponse";
import ReportLocationRequest from "../requests/ReportLocationRequest";

export default class DriverLocationDtoMapper {
  static toResponse(location: DriverLocation): DriverLocationResponse {
    return {
      lat: location.lat,
      lng: location.lng,
      heading: location.heading,
      speed: location.speed,
      accuracy: location.accuracy,
      recordedAt: location.recordedAt.toISOString(),
    };
  }

  static fromReportToDomain(dto: ReportLocationRequest): DriverLocation[] {
    return dto.locations.map((point) =>
      DriverLocation.create({
        lat: point.lat,
        lng: point.lng,
        heading: point.heading,
        speed: point.speed,
        accuracy: point.accuracy,
        recordedAt: new Date(point.recordedAt),
      }),
    );
  }
}
