import z from "zod";

export const LEDGER_DEFAULT_PAGE_SIZE = 20;
export const LEDGER_MAX_PAGE_SIZE = 100;

/** Query string for GET /billing/credits/ledger. */
const creditLedgerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(LEDGER_MAX_PAGE_SIZE).default(LEDGER_DEFAULT_PAGE_SIZE),
});

export type CreditLedgerQueryParams = z.infer<typeof creditLedgerQuerySchema>;

export default creditLedgerQuerySchema;
