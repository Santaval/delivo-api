import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";

export interface IncomesFinancialSummary {
 total: number;
    increasePercentage: number;
    averagePerDay: number;
    byDay: Record<string, number>;
    byWeek: Record<string, number>;
    byMonth: Record<string, number>;
    byQuarter: Record<string, number>;
    byYear: Record<string, number>;
}

export type FinancialSummary = {
  incomes: IncomesFinancialSummary;
};

export default interface IFinancialSummaryCalculator {
  getStats(start: Date, end: Date, companyId: CompanyId):  Promise<FinancialSummary>;
}
