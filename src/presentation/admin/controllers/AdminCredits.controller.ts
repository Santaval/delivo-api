import { Request, Response } from "express";
import { ICreditsService } from "@/application/credits/services/interfaces/ICreditsService";
import CreditLedgerEntryMapper from "@/presentation/billing/mappers/CreditLedgerEntry.mapper";
import adminCreditAdjustmentSchema from "../validators/adminCreditAdjustment";

export default class AdminCreditsController {
  constructor(private readonly creditsService: ICreditsService) {}

  /** POST /admin/companies/:companyId/credits */
  async adjust(req: Request, res: Response): Promise<void> {
    // validateSchema only checks the body; it does not replace req.body with the parsed value.
    const { delta, note } = adminCreditAdjustmentSchema.parse(req.body);
    const { entry, balance } = await this.creditsService.adminAdjust({
      companyId: req.params.companyId as string,
      delta,
      note,
    });
    res.status(201).json({ entry: CreditLedgerEntryMapper.toAdminResponse(entry), balance });
  }

  /** GET /admin/companies/:companyId/credits */
  async overview(req: Request, res: Response): Promise<void> {
    const companyId = req.params.companyId as string;
    const { balance, entries } = await this.creditsService.adminOverview(companyId);
    res.json({ companyId, balance, ledger: entries.map(CreditLedgerEntryMapper.toAdminResponse) });
  }
}
