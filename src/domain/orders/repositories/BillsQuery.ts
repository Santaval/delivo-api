import { OrderStatusType } from "../valueObjects/orderStatus.valueObject";
import { OrderDeliveryStatusType } from "../valueObjects/orderDeliveryStatus";

/** Filters shared by the paginated bills query and its per-status counts. */
export interface BillsFilter {
  companyId: string;
  deliveryStatuses: OrderDeliveryStatusType[];
  /** Matches client name (contains) or, when numeric, the bill number. */
  search?: string;
}

export interface BillsQuery extends BillsFilter {
  /** Payment status; omit to include every status. */
  status?: OrderStatusType;
}

export type BillStatusCounts = Record<OrderStatusType, number>;
