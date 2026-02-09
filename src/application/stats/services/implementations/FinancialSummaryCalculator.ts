import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import Order from "@/domain/orders/entities/Order";
import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import IFinancialSummaryCalculator, { FinancialSummary, IncomesFinancialSummary } from "@/domain/stats/services/IFinancialSummaryCalculator";
import moment from "moment";

export default class FinancialSummaryCalculator implements IFinancialSummaryCalculator {

  constructor(
    private readonly orderRepository: IOrderRepository,
  ) {}

  async getStats(start: Date, end: Date, companyId: CompanyId): Promise<FinancialSummary> {
    const currentIncomesReport =  await this.getIncomesReport(start, end, companyId);
    return {
      incomes: currentIncomesReport
    }
  }   


  private async getIncomesReport(start: Date, end: Date, companyId: CompanyId, withPrevious: boolean = true) : Promise<IncomesFinancialSummary> {
    const orders = await this.orderRepository.byTimeRange(start, end, companyId);
    const totalIncome = orders.reduce((acc, order) => acc + order.total, 0);
    const averageIncomePerDay = totalIncome / moment(end).diff(moment(start), 'days') || 0;

    const previousIncomesReport = withPrevious ? await this.getPreviousIncomesReport(start, end, companyId) : null;

    return {
      total: totalIncome,
      averagePerDay: averageIncomePerDay,
      increasePercentage: previousIncomesReport ? ((totalIncome - previousIncomesReport.total) / previousIncomesReport.total) * 100 : 0,
      byDay: this.getIncomesReportGroupedByDay(orders),
      byWeek: this.getIncomesReportGroupedByWeek(orders),
      byMonth: this.getIncomesReportGroupedByMonth(orders),
      byQuarter: this.getIncomesReportGroupedByQuarter(orders),
      byYear: this.getIncomesReportGroupedByYear(orders),
    };
  }

  private async getPreviousIncomesReport(start: Date, end: Date, companyId: CompanyId) : Promise<IncomesFinancialSummary> {
    const diff = moment(end).diff(moment(start), 'days');
    const previousStart = moment(start).subtract(diff, 'days').toDate();
    const previousEnd = moment(end).subtract(diff, 'days').toDate();
    const report = await this.getIncomesReport(previousStart, previousEnd, companyId, false);
    return report;
  }

  private getIncomesReportGroupedByDay(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      const day = moment(order.createdAt).format("YYYY-MM-DD");
      acc[day] = (acc[day] || 0) + order.total;
      return acc;
    }, {} as Record<string, number>);
  }

  private getIncomesReportGroupedByWeek(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      const week = moment(order.createdAt).isoWeek();
      acc[week] = (acc[week] || 0) + order.total;
      return acc;
    }, {} as Record<string, number>);
  }

  private getIncomesReportGroupedByMonth(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      const month = moment(order.createdAt).format("YYYY-MM") ;
      acc[month] = (acc[month] || 0) + order.total;
      return acc;
    }, {} as Record<string, number>);
  }

  private getIncomesReportGroupedByQuarter(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      const quarter = moment(order.createdAt).quarter();
      acc[quarter] = (acc[quarter] || 0) + order.total;
      return acc;
    }, {} as Record<string, number>);
  }

  private getIncomesReportGroupedByYear(orders: Order[]): Record<string, number> {
    return orders.reduce((acc, order) => {
      const year = moment(order.createdAt).year();
      acc[year] = (acc[year] || 0) + order.total;
      return acc;
    }, {} as Record<string, number>);
  }


}
