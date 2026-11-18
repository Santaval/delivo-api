import { CreditLedgerEntry } from "@/domain/credits/entities/CreditLedgerEntry";
import { CreditReasonType } from "@/domain/credits/valueObjects/creditReason.valueObject";
import { PageRequest, PaginatedResult } from "@/domain/core/pagination/Pagination";

export interface CreditGrantInput {
  companyId: string;
  /** Signed, non-zero. Positive = grant, negative = adjustment/refund debit. */
  delta: number;
  reason: CreditReasonType;
  providerTransactionId?: string | null;
  productId?: string | null;
  environment?: string | null;
  note?: string | null;
  createdByUserId?: string | null;
}

export interface ICreditRepository {
  /** Current balance, or null when the company has no CreditBalance row. */
  getBalance(companyId: string): Promise<number | null>;

  /** Ledger entries of a company, newest first. */
  listEntries(companyId: string, page: PageRequest): Promise<PaginatedResult<CreditLedgerEntry>>;

  /**
   * Applies a signed delta and records the ledger entry. It never checks the floor, so
   * refunds and admin adjustments may take the balance below it. The balance update and the
   * ledger insert are atomic.
   * @throws DuplicateCreditTransactionError when `providerTransactionId` was already recorded.
   */
  grant(input: CreditGrantInput): Promise<CreditLedgerEntry>;

  /**
   * Conditional debit: subtracts `amount` only if the resulting balance stays >= `floor`.
   * MUST run inside a transaction (e.g. the bill-issuing unit of work), followed by
   * `recordBillIssued` in that same transaction.
   * @returns the balance after the debit, or null when it would cross `floor`.
   */
  tryConsume(companyId: string, amount: number, floor: number): Promise<number | null>;

  /** Inserts the BILL_ISSUED ledger row after a successful `tryConsume`, in the same transaction. */
  recordBillIssued(input: { companyId: string; billId: string; amount: number; balanceAfter: number }): Promise<CreditLedgerEntry>;
}
