import { ClientPayment, PaymentMethod as PrismaPaymentMethod, Prisma } from '@/infrastructure/prisma/generated/prisma/client';
import { ClientPaymentCreateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import PrismaPaymentMapper, { FullPaymentType } from '@/infrastructure/orders/mappers/PrismaPaymentMapper';
import Payment from '@/domain/orders/entities/Payment';
import PaymentMethod from '@/domain/orders/entities/PaymentMethod';

describe('PrismaPaymentMapper', () => {
  const createDecimal = (value: string): Prisma.Decimal => new Prisma.Decimal(value);

  const mockPrismaPaymentMethod: PrismaPaymentMethod = {
    id: 'pm-uuid-1',
    name: 'Cash',
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  const mockPrismaPayment: ClientPayment & { method: PrismaPaymentMethod } = {
    id: 'payment-uuid-1',
    billId: 'order-uuid-1',
    amount: createDecimal('100.00'),
    methodId: 'pm-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    method: mockPrismaPaymentMethod,
  };

  describe('toDomain', () => {
    it('maps all fields correctly', () => {
      const payment = PrismaPaymentMapper.toDomain(mockPrismaPayment);

      expect(payment).toBeInstanceOf(Payment);
      expect(payment.id.value).toBe(mockPrismaPayment.id);
      expect(payment.amount.value).toBe(100);
    });

    it('converts Decimal amount to number', () => {
      const payment = PrismaPaymentMapper.toDomain(mockPrismaPayment);

      expect(payment.amount.value).toBe(100);
    });

    it('maps method correctly', () => {
      const payment = PrismaPaymentMapper.toDomain(mockPrismaPayment);

      expect(payment.method).toBeInstanceOf(PaymentMethod);
      expect(payment.method.name).toBe('Cash');
    });
  });

  describe('toPersistence', () => {
    it('returns correct ClientPaymentCreateArgs', () => {
      const mockDomainMethod = new PaymentMethod({
        id: 'pm-uuid-1',
        name: 'Cash',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const domainPayment = new Payment({
        id: 'payment-uuid-1',
        amount: 100,
        method: mockDomainMethod,
        orderId: 'order-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ClientPaymentCreateArgs = PrismaPaymentMapper.toPersistence(domainPayment);

      expect(result.data).toMatchObject({
        amount: 100,
        methodId: 'pm-uuid-1',
        billId: 'order-uuid-1',
      });
      expect(result.include).toEqual({ method: true });
    });
  });
});
