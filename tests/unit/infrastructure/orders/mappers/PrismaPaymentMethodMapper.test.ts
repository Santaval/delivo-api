import { PaymentMethod as PrismaPaymentMethod } from '@/infrastructure/prisma/generated/prisma/client';
import { PaymentMethodCreateArgs, PaymentMethodUpdateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import PrismaPaymentMethodMapper from '@/infrastructure/orders/mappers/PrismaPaymentMethodMapper';
import PaymentMethod from '@/domain/orders/entities/PaymentMethod';

describe('PrismaPaymentMethodMapper', () => {
  const mockPrismaRow: PrismaPaymentMethod = {
    id: 'pm-uuid-1',
    name: 'Cash',
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  describe('toDomain', () => {
    it('maps all fields correctly', () => {
      const paymentMethod = PrismaPaymentMethodMapper.toDomain(mockPrismaRow);

      expect(paymentMethod).toBeInstanceOf(PaymentMethod);
      expect(paymentMethod.id).toBe(mockPrismaRow.id);
      expect(paymentMethod.name).toBe(mockPrismaRow.name);
      expect(paymentMethod.companyId).toBe(mockPrismaRow.companyId);
    });
  });

  describe('toPersistenceCreate', () => {
    it('returns correct PaymentMethodCreateArgs', () => {
      const domainPaymentMethod = new PaymentMethod({
        id: 'pm-uuid-1',
        name: 'Cash',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: PaymentMethodCreateArgs = PrismaPaymentMethodMapper.toPersistenceCreate(domainPaymentMethod);

      expect(result.data).toEqual({
        name: 'Cash',
        companyId: 'company-uuid-1',
      });
    });
  });

  describe('toPersistenceUpdate', () => {
    it('returns correct PaymentMethodUpdateArgs with where clause', () => {
      const domainPaymentMethod = new PaymentMethod({
        id: 'pm-uuid-1',
        name: 'Updated Cash',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      const result: PaymentMethodUpdateArgs = PrismaPaymentMethodMapper.toPersistenceUpdate(domainPaymentMethod);

      expect(result.where).toEqual({ id: 'pm-uuid-1' });
      expect(result.data).toMatchObject({
        name: 'Updated Cash',
        companyId: 'company-uuid-1',
      });
    });
  });
});
