import { RoutePoint } from "@/domain/routes";
import PrismaOrderMapper from "@/infrastructure/orders/mappers/PrismaOrderMapper";
import { ClientBillItem } from "@/infrastructure/prisma/generated/prisma/browser";
import { Client, ClientBill, RoutePoint as PrismaRoutePoint } from "@/infrastructure/prisma/generated/prisma/client";
import { RoutePointCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";


export type RawRoutePoint = PrismaRoutePoint & { bill: ClientBill & {client: Client, items: ClientBillItem[] } };

export default class PrismaRoutePointMapper {
  static toDomain(raw: RawRoutePoint): RoutePoint {
    return new RoutePoint({
      id: raw.id,
      order: PrismaOrderMapper.toDomain(raw.bill),
      status: raw.status,
      routeId: raw.routeId,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    });
  }

  static toPersistence(domain: RoutePoint): RoutePointCreateArgs {
    return {
      data: {
        billId: domain.order.id,
        routeId: domain.routeId,
      }
    };
  }
}