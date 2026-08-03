import { Subscription } from "@/domain/billing/entities/Subscription";
import { PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";
import { SubscriptionStatusType } from "@/domain/billing/valueObjects/subscriptionStatus.valueObject";
import { PaymentProviderType } from "@/domain/billing/valueObjects/paymentProvider.valueObject";

export interface UpsertSubscriptionByProviderInput {
  companyId: string;
  tier: PlanTierType;
  status: SubscriptionStatusType;
  provider: PaymentProviderType;
  providerCustomerId: string;
  providerEntitlement?: string | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
}

export interface ISubscriptionRepository {
  findByCompanyId(companyId: string): Promise<Subscription | null>;
  findByProviderCustomerId(providerCustomerId: string): Promise<Subscription | null>;
  create(subscription: Subscription): Promise<Subscription>;
  update(subscription: Subscription): Promise<Subscription>;
  upsertByProviderCustomerId(input: UpsertSubscriptionByProviderInput): Promise<Subscription>;
}
