import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import IFinancialSummaryCalculator from "@/domain/stats/services/IFinancialSummaryCalculator";
import CompanyIdParser from "@/presentation/core/utils/companyIdParser";
import { Request, Response } from "express";
import moment from "moment";

export default class StatsController {
  constructor (
    private readonly financialSummaryCalculator: IFinancialSummaryCalculator
  ) {}

  async financialSummary(req: Request, res: Response) {
    const companyId = CompanyIdParser(req)

    const startStr = req.query.start as string | undefined;
    const endStr = req.query.end as string | undefined;

    const start = moment(startStr || moment().startOf("month")).toDate();
    const end = moment(endStr || moment().endOf("month")).toDate();
    const result = await this.financialSummaryCalculator.getStats(start, end, CompanyId.create(companyId));
    res.json(result);
  }
}