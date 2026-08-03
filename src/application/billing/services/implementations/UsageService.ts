import { LimitedResource } from "@/application/billing/PlanCatalog";
import { currentDayRange, currentMonthRange } from "@/application/billing/utils/billingWindows";
import { IUsageService } from "@/application/billing/services/interfaces/IUsageService";
import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import IRouteRepository from "@/domain/routes/repositories/IRouteRepository";
import { IClientRepository } from "@/domain/clients/repositories/IClientRepository";
import { IProductRepository } from "@/domain/products/repositories/IProductRepository";
import { ICompanyMemberRepository } from "@/domain/companies/repositories/ICompanyMemberRepository";

/**
 * Measures a company's current consumption per `LimitedResource` (Billing MVP).
 *
 * Usage is derived on the fly from the existing domain tables — there is no
 * `UsageCounter` table in the MVP. This keeps the MVP simple (nothing to keep in
 * sync, nothing to backfill), at the cost of recomputing monthly document counts
 * from `ClientBill` on every check. If that count becomes expensive at scale,
 * the intended migration is a `UsageCounter(companyId, period, resource, count)`
 * table maintained incrementally on write; that is recorded here as deliberate
 * tech debt, not implemented now.
 *
 * `documents` usage counts `ClientBill` creation as its proxy for "fiscal
 * document issued", since there is no Hacienda e-invoicing integration yet.
 * Once electronic emission exists, the counting point should move from bill
 * creation to the emission event.
 *
 * Monthly/daily windows are evaluated in America/Costa_Rica (see
 * `billingWindows.ts`), so a company's month/day rolls over at local midnight
 * regardless of server timezone.
 */
export class UsageService implements IUsageService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly routeRepository: IRouteRepository,
    private readonly clientRepository: IClientRepository,
    private readonly productRepository: IProductRepository,
    private readonly companyMemberRepository: ICompanyMemberRepository,
  ) { }

  /** Current consumption of `resource` for `companyId`, evaluated over that resource's window. */
  async currentUsage(companyId: string, resource: LimitedResource): Promise<number> {
    switch (resource) {
      case "documents": {
        const { start, end } = currentMonthRange();
        return this.orderRepository.countByCompanyAndIssueDateRange(companyId, start, end);
      }
      case "routes": {
        const { start, end } = currentDayRange();
        return this.routeRepository.countByCompanyAndCreatedAtRange(companyId, start, end);
      }
      case "clients":
        return this.clientRepository.countByCompanyId(companyId);
      case "products":
        return this.productRepository.countByCompanyId(companyId);
      case "drivers":
        return this.companyMemberRepository.countByCompanyAndRole(companyId, "DEALER");
      default: {
        const exhaustiveCheck: never = resource;
        throw new Error(`Unsupported limited resource: ${exhaustiveCheck}`);
      }
    }
  }
}
