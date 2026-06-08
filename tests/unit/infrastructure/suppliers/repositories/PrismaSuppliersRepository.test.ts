import { Supplier } from '@/domain/suppliers/entities/Supplier';
import DatabaseError from '@/infrastructure/core/errors/DatabaseError';
import DatabaseInsertError from '@/infrastructure/core/errors/DatabaseInsertError';
import PrismaSuppliersRepository from '@/infrastructure/suppliers/repositories/PrismaSuppliersRepository';
import { PrismaSupplierMapper } from '@/infrastructure/suppliers/mappers/PrismaSupplierMapper';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindFirst = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  return {
    prisma: {
      supplier: {
        findMany: mockFindMany,
        findFirst: mockFindFirst,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
    },
    __mockFindMany: mockFindMany,
    __mockFindFirst: mockFindFirst,
    __mockCreate: mockCreate,
    __mockUpdate: mockUpdate,
    __mockDelete: mockDelete,
  };
});

const { __mockFindMany: mockFindMany, __mockFindFirst: mockFindFirst, __mockCreate: mockCreate, __mockUpdate: mockUpdate, __mockDelete: mockDelete } = jest.requireMock('@/infrastructure/prisma/client');

describe('PrismaSuppliersRepository', () => {
  let repository: PrismaSuppliersRepository;

  const mockPrismaRow = {
    id: 'supplier-uuid-1',
    name: 'Test Supplier',
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaSuppliersRepository();
  });

  describe('all', () => {
    it('returns array of Supplier entities from database', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.all();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Supplier);
      expect(result[0].id).toBe(mockPrismaRow.id);
      expect(mockFindMany).toHaveBeenCalledWith();
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.all()).rejects.toThrow(DatabaseError);
    });
  });

  describe('find', () => {
    it('returns Supplier when found by id', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('supplier-uuid-1');

      expect(result).toBeInstanceOf(Supplier);
      expect(result?.id).toBe(mockPrismaRow.id);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'supplier-uuid-1' },
      });
    });

    it('returns null when supplier not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.find('non-existent-id');

      expect(result).toBeNull();
    });

    it('uses custom field when specified', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('Test Supplier', 'name');

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { name: 'Test Supplier' },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.find('supplier-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('creates supplier', async () => {
      const domainSupplier = new Supplier({
        id: 'supplier-uuid-1',
        name: 'Test Supplier',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      await repository.create(domainSupplier);

      expect(mockCreate).toHaveBeenCalledWith(
        PrismaSupplierMapper.toPersistence(domainSupplier)
      );
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainSupplier = new Supplier({
        id: 'supplier-uuid-1',
        name: 'Test Supplier',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.create(domainSupplier)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('update', () => {
    it('updates supplier with correct arguments', async () => {
      const domainSupplier = new Supplier({
        id: 'supplier-uuid-1',
        name: 'Updated Supplier',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      mockUpdate.mockResolvedValue(mockPrismaRow);

      await repository.update(domainSupplier);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'supplier-uuid-1' },
        data: PrismaSupplierMapper.toPersistence(domainSupplier).data,
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainSupplier = new Supplier({
        id: 'supplier-uuid-1',
        name: 'Updated Supplier',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.update(domainSupplier)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('delete', () => {
    it('deletes supplier with correct supplierId', async () => {
      mockDelete.mockResolvedValue(mockPrismaRow);

      await repository.delete('supplier-uuid-1');

      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 'supplier-uuid-1' },
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      mockDelete.mockRejectedValue(new Error('DB Error'));

      await expect(repository.delete('supplier-uuid-1')).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('findByCompanyId', () => {
    it('returns array of suppliers for company', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.findByCompanyId('company-uuid-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Supplier);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { companyId: 'company-uuid-1' },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findByCompanyId('company-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });
});
