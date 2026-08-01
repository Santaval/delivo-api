import { Request, Response } from "express";
import { IEntitlementService } from "@/application/billing/services/interfaces/IEntitlementService";
import { ISubscriptionRepository } from "@/domain/billing/repositories/ISubscriptionRepository";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import BillingStatusMapper from "../mappers/BillingStatus.mapper";

export default class BillingController {
  /**
   * `subscriptionRepository` is injected here (rather than going through a service) because the
   * status endpoint only needs to read the raw subscription row alongside the entitlement
   * summary. It depends on the domain interface, not on the Prisma implementation, so the
   * dependency direction is preserved.
   */
  constructor(
    private readonly entitlementService: IEntitlementService,
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async subscriptionStatus(req: Request, res: Response): Promise<void> {
    const companyId = CompanyIdParser(req);

    const [subscription, tier, checks] = await Promise.all([
      this.subscriptionRepository.findByCompanyId(companyId),
      this.entitlementService.effectiveTier(companyId),
      this.entitlementService.summary(companyId),
    ]);

    res.json(BillingStatusMapper.toResponse(subscription, tier, checks));
  }
}
