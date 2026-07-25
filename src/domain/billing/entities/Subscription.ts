import { SubscriptionId } from "@/domain/billing/valueObjects/subscriptionId.valueObject";
import { PlanTier, PlanTierType } from "@/domain/billing/valueObjects/planTier.valueObject";
import { SubscriptionStatus, SubscriptionStatusType } from "@/domain/billing/valueObjects/subscriptionStatus.valueObject";
import { PaymentProvider, PaymentProviderType } from "@/domain/billing/valueObjects/paymentProvider.valueObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";

export class Subscription {
  private props: SubscriptionProps;

  constructor(props: SubscriptionConstructorProps) {
    this.props = {
      id: SubscriptionId.create(props.id),
      tier: PlanTier.create(props.tier),
      status: SubscriptionStatus.create(props.status),
      provider: props.provider ? PaymentProvider.create(props.provider) : null,
      providerCustomerId: props.providerCustomerId ?? null,
      providerEntitlement: props.providerEntitlement ?? null,
      currentPeriodStart: props.currentPeriodStart ? new Date(props.currentPeriodStart) : null,
      currentPeriodEnd: props.currentPeriodEnd ? new Date(props.currentPeriodEnd) : null,
      companyId: CompanyId.create(props.companyId),
      createdAt: new Date(props.createdAt),
      updatedAt: new Date(props.updatedAt),
    };
  }

  get id() { return this.props.id.value; }
  get tier() { return this.props.tier.value; }
  get status() { return this.props.status.value; }
  get provider() { return this.props.provider?.value ?? null; }
  get providerCustomerId() { return this.props.providerCustomerId; }
  get providerEntitlement() { return this.props.providerEntitlement; }
  get currentPeriodStart() { return this.props.currentPeriodStart; }
  get currentPeriodEnd() { return this.props.currentPeriodEnd; }
  get companyId() { return this.props.companyId.value; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }

  /** A subscription still grants its paid tier while the paid period has not lapsed. */
  isActive(now: Date = new Date()): boolean {
    if (this.status === "EXPIRED") return false;
    if (this.currentPeriodEnd && this.currentPeriodEnd.getTime() < now.getTime()) return false;
    return true; // ACTIVE, IN_GRACE_PERIOD, and CANCELLED-but-not-yet-lapsed keep access
  }

  /** Tier actually in force: a lapsed/expired subscription silently downgrades to FREE. */
  effectiveTier(now: Date = new Date()): PlanTierType {
    return this.isActive(now) ? this.tier : "FREE";
  }
}

export interface SubscriptionProps {
  id: SubscriptionId;
  tier: PlanTier;
  status: SubscriptionStatus;
  provider: PaymentProvider | null;
  providerCustomerId: string | null;
  providerEntitlement: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  companyId: CompanyId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionConstructorProps {
  id: string;
  tier: PlanTierType;
  status: SubscriptionStatusType;
  provider?: PaymentProviderType | null;
  providerCustomerId?: string | null;
  providerEntitlement?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
