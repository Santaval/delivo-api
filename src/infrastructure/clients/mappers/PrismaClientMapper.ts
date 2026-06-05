/* eslint-disable @typescript-eslint/no-explicit-any */

import { Client } from "@/domain/clients/entities/Client";
import { Client as PrismaClient } from "@/infrastructure/prisma/generated/prisma/client";
import { ClientCreateArgs, ClientUpdateArgs } from "@/infrastructure/prisma/generated/prisma/models";

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
      deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
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

  static toPersistenceUpdate(client: Client): ClientUpdateArgs {
    return {
      data: {
        name: client.name,
        phoneNumber: client.phoneNumber?.value || null,
        email: client.email?.value || null,
      },
      where: { id: client.id.value },
    };
  }

  static toPersistenceRestore(existingId: string, client: Client): ClientUpdateArgs {
    return {
      data: {
        name: client.name,
        phoneNumber: client.phoneNumber?.value || null,
        email: client.email?.value || null,
        lat: client.location.lat,
        lng: client.location.lng,
        deletedAt: null,
      },
      where: { id: existingId },
    };
  }
}
