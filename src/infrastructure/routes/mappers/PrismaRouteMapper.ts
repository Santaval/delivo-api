import { Route as PrismaRoute} from "@/infrastructure/prisma/generated/prisma/client";
import PrismaRoutePointMapper, { RawRoutePoint } from "./PrismaRoutePointMapper";
import { RouteCreateArgs, RouteUpdateArgs } from "@/infrastructure/prisma/generated/prisma/models";
import { Route } from "@/domain/routes/entities/Route";

export default class PrismaRouteMapper {
  static toDomain(raw: PrismaRoute & { points: RawRoutePoint[] }): Route {
    return new Route({
      id: raw.id,
      name: raw.name,
      status: raw.status,
      points: raw.points.map(PrismaRoutePointMapper.toDomain),
      companyId: raw.companyId,
    })
  }

  static toPersistence(domain: Route): RouteCreateArgs{
    return {
      data: {
        name: domain.name,
        companyId: domain.companyId
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
      },
      include: this.getIncludeConditions()
    };
  }

  static getIncludeConditions() {
    return {
      points: {
        include: {
          bill: {
            include: {
              client: true,
            }
          }
        }
      }
    };
  }
}