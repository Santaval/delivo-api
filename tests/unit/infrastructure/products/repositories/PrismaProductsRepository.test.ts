import { Product } from '@/domain/products/entities/Product';
import DatabaseError from '@/infrastructure/core/errors/DatabaseError';
import DatabaseInsertError from '@/infrastructure/core/errors/DatabaseInsertError';
import PrismaProductsRepository from '@/infrastructure/products/repositories/PrismaProductsRepository';
import { PrismaProductMapper } from '@/infrastructure/products/mappers/PrismaProductMapper';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindFirst = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();

  return {
    prisma: {
      product: {
        findMany: mockFindMany,
        findFirst: mockFindFirst,
        create: mockCreate,
        update: mockUpdate,
      },
    },
    __mockFindMany: mockFindMany,
    __mockFindFirst: mockFindFirst,
    __mockCreate: mockCreate,
    __mockUpdate: mockUpdate,
  };
});

const { __mockFindMany: mockFindMany, __mockFindFirst: mockFindFirst, __mockCreate: mockCreate, __mockUpdate: mockUpdate } = jest.requireMock('@/infrastructure/prisma/client');

describe('PrismaProductsRepository', () => {
  let repository: PrismaProductsRepository;

  const mockPrismaRow = {
    id: 'product-uuid-1',
    name: 'Test Product',
    ivaRate: '0.13',
    grossPrice: '100.00',
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    deletedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaProductsRepository();
  });

  describe('all', () => {
    it('returns array of Product entities with deletedAt null filter', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.all();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(result[0].id).toBe(mockPrismaRow.id);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.all()).rejects.toThrow(DatabaseError);
    });
  });

  describe('find', () => {
    it('returns Product when found by id', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('product-uuid-1');

      expect(result).toBeInstanceOf(Product);
      expect(result?.id).toBe(mockPrismaRow.id);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'product-uuid-1' },
      });
    });

    it('returns null when product not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.find('non-existent-id');

      expect(result).toBeNull();
    });

    it('uses custom field when specified', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('Test Product', 'name');

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { name: 'Test Product' },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.find('product-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('creates product and returns mapped entity', async () => {
      const domainProduct = new Product({
        id: 'product-uuid-1',
        name: 'Test Product',
        grossPrice: '100.00',
        ivaRate: '0.13',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockCreate.mockResolvedValue(mockPrismaRow);

      const result = await repository.create(domainProduct);

      expect(result).toBeInstanceOf(Product);
      expect(mockCreate).toHaveBeenCalledWith(
        PrismaProductMapper.toPersistence(domainProduct)
      );
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainProduct = new Product({
        id: 'product-uuid-1',
        name: 'Test Product',
        grossPrice: '100.00',
        ivaRate: '0.13',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.create(domainProduct)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('update', () => {
    it('updates product with correct arguments', async () => {
      const domainProduct = new Product({
        id: 'product-uuid-1',
        name: 'Updated Product',
        grossPrice: '150.00',
        ivaRate: '0.16',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      mockUpdate.mockResolvedValue(mockPrismaRow);

      await repository.update(domainProduct);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'product-uuid-1' },
        data: PrismaProductMapper.toPersistence(domainProduct).data,
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainProduct = new Product({
        id: 'product-uuid-1',
        name: 'Updated Product',
        grossPrice: '150.00',
        ivaRate: '0.16',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.update(domainProduct)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('delete', () => {
    it('performs logical deletion by setting deletedAt', async () => {
      mockUpdate.mockResolvedValue(mockPrismaRow);

      await repository.delete('product-uuid-1');

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'product-uuid-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.delete('product-uuid-1')).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('findByCompanyId', () => {
    it('returns array of products for company with deletedAt null', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.findByCompanyId('company-uuid-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { companyId: 'company-uuid-1', deletedAt: null },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findByCompanyId('company-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('findByName', () => {
    it('returns product when found by name and companyId', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.findByName('Test Product', 'company-uuid-1');

      expect(result).toBeInstanceOf(Product);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { name: 'Test Product', companyId: 'company-uuid-1' },
      });
    });

    it('returns null when not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByName('Non-existent', 'company-uuid-1');

      expect(result).toBeNull();
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findByName('Test Product', 'company-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('findByPriceRange', () => {
    it('returns products within price range for company', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.findByPriceRange(50, 150, 'company-uuid-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: {
          companyId: 'company-uuid-1',
          grossPrice: { gte: 50, lte: 150 },
          deletedAt: null,
        },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findByPriceRange(50, 150, 'company-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });
});
