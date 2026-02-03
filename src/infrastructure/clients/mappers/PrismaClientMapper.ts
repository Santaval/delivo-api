/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from "@/domain/clients/entities/Client";
import { Client as PrismaClient } from "@/infrastructure/prisma/generated/prisma/client";
import { ClientCreateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export class PrismaClientMapper {
  static toDomain(row: PrismaClient): Client {
    return new Client({
      id: row.id,
      name: row.name,
      phoneNumber: row.phoneNumber || undefined,
      email: row.email || undefined,
      lat: row.lat ? Number(row.lat) : null,
      lng: row.lng ? Number(row.lng) : null,
      companyId: row.companyId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  static toPersistence(client: Client): ClientCreateArgs {
    return {
      data: {
        name: client.name,
        phoneNumber: client.phoneNumber?.value || null,
        email: client.email?.value || null,
        companyId: client.companyId.value,
        lat: client.location.lat,
        lng: client.location.lng,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
    };
  }
}
