import OrderResponse from "./OrderResponse";

export default interface BillsPageResponse {
  data: OrderResponse[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
  /** Totals per payment status for the current search (independent of the `status` filter). */
  counts: {
    ALL: number;
    PENDING: number;
    PAID: number;
    CANCELLED: number;
  };
}
