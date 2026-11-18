import { Request, Response } from "express";
import { ICreditsService } from "@/application/credits/services/interfaces/ICreditsService";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import CreditLedgerEntryMapper from "../mappers/CreditLedgerEntry.mapper";
import creditLedgerQuerySchema from "../validators/creditLedgerQuery";
import CreditLedgerPageResponse from "../responses/CreditLedgerPageResponse";
import CreditsSummaryResponse from "../responses/CreditsSummaryResponse";

export default class CreditsController {
  constructor(private readonly creditsService: ICreditsService) {}

  /** GET /billing/credits */
  async summary(req: Request, res: Response): Promise<void> {
    const response: CreditsSummaryResponse = await this.creditsService.getSummary(CompanyIdParser(req));
    res.json(response);
  }

  /** GET /billing/credits/ledger?page=&pageSize= */
  async ledger(req: Request, res: Response): Promise<void> {
    const parsed = creditLedgerQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues[0].message });
      return;
    }
    const { page, pageSize } = parsed.data;

    const result = await this.creditsService.listLedger(CompanyIdParser(req), { page, pageSize });

    const totalPages = Math.ceil(result.total / result.pageSize);
    const response: CreditLedgerPageResponse = {
      data: result.items.map(CreditLedgerEntryMapper.toResponse),
      pagination: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages,
        hasNextPage: result.page < totalPages,
      },
    };
    res.json(response);
  }
}
