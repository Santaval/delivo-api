import z from "zod";

export const BILLS_DEFAULT_PAGE_SIZE = 20;
export const BILLS_MAX_PAGE_SIZE = 100;

/**
 * Query string for GET /orders/bills.
 * `status=ALL` (or omitting it) returns every payment status.
 */
const billsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(BILLS_MAX_PAGE_SIZE).default(BILLS_DEFAULT_PAGE_SIZE),
  status: z
    .enum(["ALL", "PENDING", "PAID", "CANCELLED"])
    .default("ALL")
    .transform((value) => (value === "ALL" ? undefined : value)),
  search: z.string().trim().max(100).optional(),
});

export type BillsQueryParams = z.infer<typeof billsQuerySchema>;

export default billsQuerySchema;
