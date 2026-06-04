import FinancialSummaryCalculator from '@/application/stats/services/implementations/FinancialSummaryCalculator';
import IOrderRepository from '@/domain/orders/repositories/IOrderRepository';
import { CompanyId } from '@/domain/companies/valueObjects/companyId.valueObject';
import { createOrder } from '@/tests/mocks/domain';

describe('FinancialSummaryCalculator', () => {
  let calculator: FinancialSummaryCalculator;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      findById: jest.fn(),
      findByCompany: jest.fn(),
      byCompanyAndManyDeliveryStatus: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      getItem: jest.fn(),
      byTimeRange: jest.fn(),
      byClientAndManyDeliveryStatus: jest.fn(),
    } as jest.Mocked<IOrderRepository>;

    calculator = new FinancialSummaryCalculator(mockOrderRepository);
  });

  describe('getStats', () => {
    it('returns financial summary with incomes report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 90, ivaTotal: 10, total: 100, createdAt: '2024-01-01' }),
        createOrder({ id: 'order-2', subtotal: 180, ivaTotal: 20, total: 200, createdAt: '2024-01-02' }),
        createOrder({ id: 'order-3', subtotal: 135, ivaTotal: 15, total: 150, createdAt: '2024-01-03' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(mockOrderRepository.byTimeRange).toHaveBeenCalledWith(startDate, endDate, companyId);
      expect(result.incomes).toBeDefined();
      expect(result.incomes.total).toBe(450);
    });

    it('calculates average income per day correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-04');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 270, ivaTotal: 30, total: 300, createdAt: '2024-01-01' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.averagePerDay).toBe(100);
    });

    it('calculates increase percentage compared to previous period', async () => {
      const startDate = new Date('2024-01-08');
      const endDate = new Date('2024-01-14');
      const companyId = { value: 'company-1' } as CompanyId;

      const currentOrders = [
        createOrder({ id: 'order-1', subtotal: 180, ivaTotal: 20, total: 200, createdAt: '2024-01-08' }),
      ];

      const previousOrders = [
        createOrder({ id: 'order-2', subtotal: 90, ivaTotal: 10, total: 100, createdAt: '2024-01-01' }),
      ];

      mockOrderRepository.byTimeRange
        .mockResolvedValueOnce(currentOrders)
        .mockResolvedValueOnce(previousOrders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.increasePercentage).toBe(100);
    });

    it('groups orders by day correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-03');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 113, ivaTotal: 13, total: 126, createdAt: '2024-01-01T10:00:00.000Z' }),
        createOrder({ id: 'order-2', subtotal: 110, ivaTotal: 14, total: 124, createdAt: '2024-01-01T15:00:00.000Z' }),
        createOrder({ id: 'order-3', subtotal: 180, ivaTotal: 20, total: 200, createdAt: '2024-01-02T10:00:00.000Z' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.byDay['2024-01-01']).toBe(250);
      expect(result.incomes.byDay['2024-01-02']).toBe(200);
    });

    it('groups orders by week correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 90, ivaTotal: 10, total: 100, createdAt: '2024-01-08' }),
        createOrder({ id: 'order-2', subtotal: 180, ivaTotal: 20, total: 200, createdAt: '2024-01-15' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.byWeek).toBeDefined();
    });

    it('groups orders by month correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 135, ivaTotal: 15, total: 150, createdAt: '2024-03-15' }),
        createOrder({ id: 'order-2', subtotal: 135, ivaTotal: 15, total: 150, createdAt: '2024-03-20' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.byMonth['2024-03']).toBe(300);
    });

    it('groups orders by quarter correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 45, ivaTotal: 5, total: 50, createdAt: '2024-04-15' }),
        createOrder({ id: 'order-2', subtotal: 180, ivaTotal: 20, total: 200, createdAt: '2024-05-20' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.byQuarter).toBeDefined();
    });

    it('groups orders by year correctly', async () => {
      const startDate = new Date('2023-01-01');
      const endDate = new Date('2024-12-31');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 90, ivaTotal: 10, total: 100, createdAt: '2023-06-15' }),
        createOrder({ id: 'order-2', subtotal: 180, ivaTotal: 20, total: 200, createdAt: '2024-06-20' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.byYear['2023']).toBe(100);
      expect(result.incomes.byYear['2024']).toBe(200);
    });

    it('handles zero orders gracefully', async () => {
      const startDate = new Date('2024-01-08');
      const endDate = new Date('2024-01-14');
      const companyId = { value: 'company-1' } as CompanyId;

      mockOrderRepository.byTimeRange.mockResolvedValue([]);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.total).toBe(0);
      expect(result.incomes.averagePerDay).toBe(0);
    });

    it('handles single order correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07');
      const companyId = { value: 'company-1' } as CompanyId;

      const orders = [
        createOrder({ id: 'order-1', subtotal: 90, ivaTotal: 10, total: 100, createdAt: '2024-01-02' }),
      ];

      mockOrderRepository.byTimeRange.mockResolvedValue(orders);

      const result = await calculator.getStats(startDate, endDate, companyId);

      expect(result.incomes.total).toBe(100);
    });
  });
});