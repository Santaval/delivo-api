import { Request, Response } from 'express';
import StatsController from './Stats.controller';
import IFinancialSummaryCalculator from '@/domain/stats/services/IFinancialSummaryCalculator';

describe('StatsController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  let financialSummaryCalculator: jest.Mocked<IFinancialSummaryCalculator>;
  let controller: StatsController;

  beforeEach(() => {
    financialSummaryCalculator = { getStats: jest.fn() } as any;
    controller = new StatsController(financialSummaryCalculator);
  });

  describe('financialSummary', () => {
    it('should return financial summary with default dates', async () => {
      financialSummaryCalculator.getStats.mockResolvedValue({ totalSales: 1000, totalOrders: 5 } as any);
      const req = { headers: { 'x-company-id': 'comp-1' }, query: {} } as unknown as Request;
      const res = mockRes();
      await controller.financialSummary(req, res);
      expect(financialSummaryCalculator.getStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ totalSales: 1000 }));
    });

    it('should return financial summary with provided dates', async () => {
      financialSummaryCalculator.getStats.mockResolvedValue({ totalSales: 500, totalOrders: 2 } as any);
      const req = {
        headers: { 'x-company-id': 'comp-1' },
        query: { start: '2024-01-01', end: '2024-01-31' },
      } as unknown as Request;
      const res = mockRes();
      await controller.financialSummary(req, res);
      expect(financialSummaryCalculator.getStats).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ totalSales: 500 }));
    });
  });
});
