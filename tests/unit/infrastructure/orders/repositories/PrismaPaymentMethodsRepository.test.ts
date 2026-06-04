import { CompanyId } from '@/domain/companies/valueObjects/companyId.valueObject';
import PrismaPaymentMethodsRepository from '@/infrastructure/orders/repositories/PrismaPaymentMethodsRepository';
import PaymentMethod from '@/domain/orders/entities/PaymentMethod';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  return {
    prisma: {
      paymentMethod: {
        findMany: mockFindMany,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
    },
    __mockFindMany: mockFindMany,
    __mockCreate: mockCreate,
    __mockUpdate: mockUpdate,
    __mockDelete: mockDelete,
  };
});

const { __mockFindMany: mockFindMany, __mockCreate: mockCreate, __mockUpdate: mockUpdate, __mockDelete: mockDelete } = jest.requireMock('@/infrastructure/prisma/client');

describe('PrismaPaymentMethodsRepository', () => {
  let repository: PrismaPaymentMethodsRepository;

  const mockPrismaRow = {
    id: 'pm-uuid-1',
    name: 'Cash',
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaPaymentMethodsRepository();
  });

  describe('allByCompany', () => {
    it('returns array of PaymentMethod entities', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const companyId = new CompanyId('company-uuid-1');
      const result = await repository.allByCompany(companyId);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(PaymentMethod);
      expect(result[0].name).toBe('Cash');
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { companyId: 'company-uuid-1' },
      });
    });

    it('returns empty array when no payment methods found', async () => {
      mockFindMany.mockResolvedValue([]);

      const companyId = new CompanyId('company-uuid-1');
      const result = await repository.allByCompany(companyId);

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('creates payment method and returns mapped entity', async () => {
      mockCreate.mockResolvedValue(mockPrismaRow);

      const domainPaymentMethod = new PaymentMethod({
        id: 'pm-uuid-1',
        name: 'Cash',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result = await repository.create(domainPaymentMethod);

      expect(result).toBeInstanceOf(PaymentMethod);
      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates payment method and returns mapped entity', async () => {
      mockUpdate.mockResolvedValue({ ...mockPrismaRow, name: 'Updated Cash' });

      const domainPaymentMethod = new PaymentMethod({
        id: 'pm-uuid-1',
        name: 'Updated Cash',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      const result = await repository.update(domainPaymentMethod);

      expect(result).toBeInstanceOf(PaymentMethod);
      expect(mockUpdate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes payment method with correct id', async () => {
      mockDelete.mockResolvedValue(mockPrismaRow);

      await repository.delete('pm-uuid-1');

      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 'pm-uuid-1' },
      });
    });
  });
});
