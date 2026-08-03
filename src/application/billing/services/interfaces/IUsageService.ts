import { LimitedResource } from "@/application/billing/PlanCatalog";

export interface IUsageService {
  /** Current consumption of `resource` for `companyId`, evaluated over that resource's window. */
  currentUsage(companyId: string, resource: LimitedResource): Promise<number>;
}
