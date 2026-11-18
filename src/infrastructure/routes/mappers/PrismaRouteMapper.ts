import { Route as PrismaRoute, RouteDriverLocation as PrismaRouteDriverLocation, RouteStatus} from "@/infrastructure/prisma/generated/prisma/client";
import PrismaRoutePointMapper, { RawRoutePoint } from "./PrismaRoutePointMapper";
import { RouteCreateArgs, RouteUpdateArgs } from "@/infrastructure/prisma/generated/prisma/models";
import { Route } from "@/domain/routes/entities/Route";
import { DriverLocation } from "@/domain/routes/valueObjects/driverLocation.valueObject";

export type RawRouteDriver = { id: string; name: string; surnames: string; email: string };

export default class PrismaRouteMapper {
  static toDomain(raw: PrismaRoute & { points: RawRoutePoint[]; driver?: RawRouteDriver | null; driverLocation?: PrismaRouteDriverLocation | null }): Route {
    return new Route({
      id: raw.id,
      name: raw.name,
      status: raw.status,
      polyline: raw.polyline,
      points: raw.points.map(PrismaRoutePointMapper.toDomain),
      companyId: raw.companyId,
      driverId: raw.driverId,
      driver: raw.driver ?? null,
      driverLocation: raw.driverLocation ? PrismaRouteMapper.locationToDomain(raw.driverLocation) : null,
    })
  }

  static locationToDomain(raw: PrismaRouteDriverLocation): DriverLocation {
    return DriverLocation.create({
      lat: raw.lat,
      lng: raw.lng,
      heading: raw.heading,
      speed: raw.speed,
      accuracy: raw.accuracy,
      recordedAt: raw.recordedAt,
    });
  }

  static toPersistence(domain: Route): RouteCreateArgs{
    return {
      data: {
        name: domain.name,
        companyId: domain.companyId,
        driverId: domain.driverId
      },
      include: this.getIncludeConditions()
    }
  }

  static toPersistenceUpdate(domain: Route): RouteUpdateArgs {
    return {
      where: {
        id: domain.id,
      },
      data: {
        name: domain.name,
        polyline: domain.polyline,
        driverId: domain.driverId,
        status: domain.status as RouteStatus
      },
      include: this.getIncludeConditions()
    };
  }

  static getIncludeConditions() {
    return {
      driver: {
        select: { id: true, name: true, surnames: true, email: true }
      },
      driverLocation: true,
      points: {
        include: {
          bill: {
            include: {
              client: true,
              items: {
                include: {
                  product: true
                }
              },
              payments: {
                include: {
                  method: true
                }
              }
            }
          }
        }
      }
    };
  }
}