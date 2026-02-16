import { RoutePoint } from "@/domain/routes";
import PrismaOrderMapper from "@/infrastructure/orders/mappers/PrismaOrderMapper";
import { ClientBillItem } from "@/infrastructure/prisma/generated/prisma/browser";
import { Client, ClientBill, RoutePoint as PrismaRoutePoint, RoutePointStatus } from "@/infrastructure/prisma/generated/prisma/client";
import { RoutePointCreateArgs, RoutePointUpdateArgs } from "@/infrastructure/prisma/generated/prisma/models";


export type RawRoutePoint = PrismaRoutePoint & { bill: ClientBill & {client: Client, items: ClientBillItem[] } };

export default class PrismaRoutePointMapper {
  static toDomain(raw: RawRoutePoint): RoutePoint {
    return new RoutePoint({
      id: raw.id,
      order: PrismaOrderMapper.toDomain(raw.bill),
      status: raw.status,
      routeId: raw.routeId,
      polyline: raw.polyline,
      index: raw.index,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    });
  }

  static toPersistence(domain: RoutePoint): RoutePointCreateArgs {
    return {
      data: {
        billId: domain.order.id,
        routeId: domain.routeId,
        index: domain.index,
        polyline: domain.polyline,
      }, 
      include: {
        bill: {
          include: {
            client: true,
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    };
  }

  static toPersistenceUpdate(domain: RoutePoint): RoutePointUpdateArgs {
    return {
      where: {
        id: domain.id,
      },
      data: {
        index: domain.index,
        polyline: domain.polyline,
        status: domain.status as RoutePointStatus,
      },
      include: {
        bill: {
          include: {
            client: true,
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    };
  }
}