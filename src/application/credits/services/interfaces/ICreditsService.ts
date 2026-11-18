import { CreditLedgerEntry } from "@/domain/credits/entities/CreditLedgerEntry";
import { PageRequest, PaginatedResult } from "@/domain/core/pagination/Pagination";

export interface CreditsSummary {
  balance: number;
  overdraftFloor: number;
  lowBalanceThreshold: number;
  packs: { productId: string; credits: number }[];
}

export interface ICreditsService {
  getSummary(companyId: string): Promise<CreditsSummary>;
  listLedger(companyId: string, page: PageRequest): Promise<PaginatedResult<CreditLedgerEntry>>;

  /**
   * Support/goodwill adjustment (positive or negative). It does not check the overdraft floor.
   * @throws CompanyNotFoundError when the company does not exist.
   */
  adminAdjust(input: { companyId: string; delta: number; note: string }): Promise<{ entry: CreditLedgerEntry; balance: number }>;

  /**
   * Balance and full ledger, for support.
   * @throws CompanyNotFoundError when the company does not exist.
   */
  adminOverview(companyId: string): Promise<{ balance: number; entries: CreditLedgerEntry[] }>;
}
