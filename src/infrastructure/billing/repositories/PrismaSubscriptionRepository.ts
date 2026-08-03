import { Subscription } from "@/domain/billing/entities/Subscription";
import { ISubscriptionRepository, UpsertSubscriptionByProviderInput } from "@/domain/billing/repositories/ISubscriptionRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaSubscriptionMapper } from "../mappers/PrismaSubscriptionMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";

export default class PrismaSubscriptionRepository implements ISubscriptionRepository {

  private readonly client: Prisma.TransactionClient;

  constructor(client?: Prisma.TransactionClient) {
    this.client = client || prisma;
  }

  /**
   * Find the subscription belonging to a company (1-1 relation).
   * @param companyId The ID of the company.
   * @returns A promise that resolves to a Subscription entity or null if not found.
   */
  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.client.subscription.findUnique({
        where: { companyId },
      });
      return subscription ? PrismaSubscriptionMapper.toDomain(subscription) : null;
    } catch (error) {
      console.error("Error finding subscription by company:", error);
      throw new DatabaseError("Could not find subscription by company");
    }
  }

  /**
   * Find a subscription by the payment provider's customer id (e.g. RevenueCat app_user_id).
   * @param providerCustomerId The provider-side customer identifier.
   * @returns A promise that resolves to a Subscription entity or null if not found.
   */
  async findByProviderCustomerId(providerCustomerId: string): Promise<Subscription | null> {
    try {
      const subscription = await this.client.subscription.findFirst({
        where: { providerCustomerId },
      });
      return subscription ? PrismaSubscriptionMapper.toDomain(subscription) : null;
    } catch (error) {
      console.error("Error finding subscription by provider customer id:", error);
      throw new DatabaseError("Could not find subscription by provider customer id");
    }
  }

  /**
   * Create a new subscription in the database.
   * @param subscription The Subscription entity to create.
   * @returns A promise that resolves to the created Subscription entity.
   */
  async create(subscription: Subscription): Promise<Subscription> {
    try {
      const created = await this.client.subscription.create(PrismaSubscriptionMapper.toPersistence(subscription));
      return PrismaSubscriptionMapper.toDomain(created);
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new DatabaseInsertError("Could not create subscription");
    }
  }

  /**
   * Update an existing subscription in the database.
   * @param subscription The Subscription entity to update.
   * @returns A promise that resolves to the updated Subscription entity.
   */
  async update(subscription: Subscription): Promise<Subscription> {
    try {
      const updated = await this.client.subscription.update(PrismaSubscriptionMapper.toPersistenceUpdate(subscription));
      return PrismaSubscriptionMapper.toDomain(updated);
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw new DatabaseInsertError("Could not update subscription");
    }
  }

  /**
   * Create or update the subscription tied to a provider customer id.
   *
   * Keyed on `companyId` (not `providerCustomerId`) because the RevenueCat convention used by
   * this app is `app_user_id === companyId`, and `companyId` is the column with the unique
   * constraint enforcing the 1-1 relation with `Company`.
   * @param input The provider-reported subscription data.
   * @returns A promise that resolves to the upserted Subscription entity.
   */
  async upsertByProviderCustomerId(input: UpsertSubscriptionByProviderInput): Promise<Subscription> {
    try {
      const subscription = await this.client.subscription.upsert({
        where: { companyId: input.companyId },
        create: {
          companyId: input.companyId,
          tier: input.tier,
          status: input.status,
          provider: input.provider,
          providerCustomerId: input.providerCustomerId,
          providerEntitlement: input.providerEntitlement ?? null,
          currentPeriodStart: input.currentPeriodStart ?? null,
          currentPeriodEnd: input.currentPeriodEnd ?? null,
        },
        update: {
          tier: input.tier,
          status: input.status,
          provider: input.provider,
          providerCustomerId: input.providerCustomerId,
          providerEntitlement: input.providerEntitlement ?? null,
          currentPeriodStart: input.currentPeriodStart ?? null,
          currentPeriodEnd: input.currentPeriodEnd ?? null,
        },
      });
      return PrismaSubscriptionMapper.toDomain(subscription);
    } catch (error) {
      console.error("Error upserting subscription by provider customer id:", error);
      throw new DatabaseInsertError("Could not upsert subscription by provider customer id");
    }
  }
}
