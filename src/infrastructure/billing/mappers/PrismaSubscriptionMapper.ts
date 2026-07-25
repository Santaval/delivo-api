/* eslint-disable @typescript-eslint/no-explicit-any */

import { Subscription } from "@/domain/billing/entities/Subscription";
import { Subscription as PrismaSubscription } from "@/infrastructure/prisma/generated/prisma/client";
import { SubscriptionCreateArgs, SubscriptionUpdateArgs } from "@/infrastructure/prisma/generated/prisma/models";

export class PrismaSubscriptionMapper {
  static toDomain(row: PrismaSubscription): Subscription {
    return new Subscription({
      id: row.id,
      tier: row.tier,
      status: row.status,
      provider: row.provider,
      providerCustomerId: row.providerCustomerId,
      providerEntitlement: row.providerEntitlement,
      currentPeriodStart: row.currentPeriodStart ? row.currentPeriodStart.toISOString() : null,
      currentPeriodEnd: row.currentPeriodEnd ? row.currentPeriodEnd.toISOString() : null,
      companyId: row.companyId,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    });
  }

  static toPersistence(entity: Subscription): SubscriptionCreateArgs {
    return {
      data: {
        id: entity.id,
        tier: entity.tier,
        status: entity.status,
        provider: entity.provider,
        providerCustomerId: entity.providerCustomerId,
        providerEntitlement: entity.providerEntitlement,
        currentPeriodStart: entity.currentPeriodStart,
        currentPeriodEnd: entity.currentPeriodEnd,
        companyId: entity.companyId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  }

  static toPersistenceUpdate(entity: Subscription): SubscriptionUpdateArgs {
    return {
      data: {
        tier: entity.tier,
        status: entity.status,
        provider: entity.provider,
        providerCustomerId: entity.providerCustomerId,
        providerEntitlement: entity.providerEntitlement,
        currentPeriodStart: entity.currentPeriodStart,
        currentPeriodEnd: entity.currentPeriodEnd,
      },
      where: { id: entity.id },
    };
  }
}
