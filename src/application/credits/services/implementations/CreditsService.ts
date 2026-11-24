import { CompanyNotFoundError } from "@/application/companies/errors/CompanyNotFoundError";
import { creditPacks, LOW_BALANCE_THRESHOLD, OVERDRAFT_FLOOR } from "@/application/credits/CreditPolicy";
import { CreditsSummary, ICreditsService } from "@/application/credits/services/interfaces/ICreditsService";
import { PageRequest, PaginatedResult } from "@/domain/core/pagination/Pagination";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { CreditLedgerEntry } from "@/domain/credits/entities/CreditLedgerEntry";
import { ICreditRepository } from "@/domain/credits/repositories/ICreditRepository";

export class CreditsService implements ICreditsService {
  constructor(
    private readonly creditRepository: ICreditRepository,
    private readonly companyRepository: ICompanyRepository,
  ) { }

  async getSummary(companyId: string): Promise<CreditsSummary> {
    return {
      balance: await this.balanceOf(companyId),
      overdraftFloor: OVERDRAFT_FLOOR,
      lowBalanceThreshold: LOW_BALANCE_THRESHOLD,
      packs: creditPacks(),
    };
  }

  listLedger(companyId: string, page: PageRequest): Promise<PaginatedResult<CreditLedgerEntry>> {
    return this.creditRepository.listEntries(companyId, page);
  }

  async adminAdjust(input: { companyId: string; delta: number; note: string }): Promise<{ entry: CreditLedgerEntry; balance: number }> {
    await this.requireCompany(input.companyId);

    const entry = await this.creditRepository.grant({
      companyId: input.companyId,
      delta: input.delta,
      reason: "ADMIN_ADJUSTMENT",
      note: input.note,
      createdByUserId: null,
    });

    // The key is shared, so there is no user to record; the note is the audit trail.
    console.info(`[credits] admin adjustment (companyId=${input.companyId}, delta=${input.delta}, balanceAfter=${entry.balanceAfter})`);
    return { entry, balance: entry.balanceAfter };
  }

  async adminOverview(companyId: string): Promise<{ balance: number; entries: CreditLedgerEntry[] }> {
    await this.requireCompany(companyId);
    const [balance, entries] = await Promise.all([
      this.balanceOf(companyId),
      this.creditRepository.listAllEntries(companyId),
    ]);
    return { balance, entries };
  }

  private async requireCompany(companyId: string): Promise<void> {
    const company = await this.companyRepository.find(companyId, "id");
    if (!company) throw new CompanyNotFoundError();
  }

  private async balanceOf(companyId: string): Promise<number> {
    const balance = await this.creditRepository.getBalance(companyId);
    if (balance === null) {
      console.warn(`[credits] company has no CreditBalance row, reporting 0 (companyId=${companyId})`);
      return 0;
    }
    return balance;
  }
}
