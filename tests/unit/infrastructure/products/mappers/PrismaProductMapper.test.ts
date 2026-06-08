import { Product as PrismaProduct, Prisma } from '@/infrastructure/prisma/generated/prisma/client';
import { ProductCreateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import { PrismaProductMapper } from '@/infrastructure/products/mappers/PrismaProductMapper';
import { Product } from '@/domain/products/entities/Product';

describe('PrismaProductMapper', () => {
  const createDecimal = (value: string): Prisma.Decimal => new Prisma.Decimal(value);

  const mockPrismaRow: PrismaProduct = {
    id: 'product-uuid-1',
    name: 'Test Product',
    ivaRate: createDecimal('0.13'),
    grossPrice: createDecimal('100.00'),
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    deletedAt: null,
  };

  describe('toDomain', () => {
    it('maps all fields correctly from Prisma row to Product entity', () => {
      const product = PrismaProductMapper.toDomain(mockPrismaRow);

      expect(product).toBeInstanceOf(Product);
      expect(product.id).toBe(mockPrismaRow.id);
      expect(product.name).toBe(mockPrismaRow.name);
      expect(product.companyId).toBe(mockPrismaRow.companyId);
    });

    it('converts ivaRate Decimal to string', () => {
      const product = PrismaProductMapper.toDomain(mockPrismaRow);

      expect(product.pricing.ivaRate).toBe(0.13);
    });

    it('converts grossPrice Decimal to string', () => {
      const product = PrismaProductMapper.toDomain(mockPrismaRow);

      expect(product.pricing.grossPrice).toBe(100);
    });

    it('handles null deletedAt', () => {
      const product = PrismaProductMapper.toDomain(mockPrismaRow);

      expect(product.deletedAt).toBeNull();
    });

    it('handles non-null deletedAt', () => {
      const rowWithDeletedAt: PrismaProduct = {
        ...mockPrismaRow,
        deletedAt: new Date('2024-02-01T10:00:00Z'),
      };

      const product = PrismaProductMapper.toDomain(rowWithDeletedAt);

      expect(product.deletedAt).toBeInstanceOf(Date);
      expect(product.deletedAt?.toISOString()).toBe('2024-02-01T10:00:00.000Z');
    });
  });

  describe('toPersistence', () => {
    it('returns correct ProductCreateArgs with data object', () => {
      const domainProduct = new Product({
        id: 'product-uuid-1',
        name: 'Test Product',
        grossPrice: '100.00',
        ivaRate: '0.13',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ProductCreateArgs = PrismaProductMapper.toPersistence(domainProduct);

      expect(result.data).toEqual({
        name: 'Test Product',
        ivaRate: 0.13,
        grossPrice: 100,
        companyId: 'company-uuid-1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      });
    });

    it('extracts pricing from Money value object', () => {
      const domainProduct = new Product({
        id: 'product-uuid-1',
        name: 'Test Product',
        grossPrice: 150.00,
        ivaRate: 0.16,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ProductCreateArgs = PrismaProductMapper.toPersistence(domainProduct);

      expect(result.data.ivaRate).toBeDefined();
      expect(result.data.grossPrice).toBeDefined();
    });
  });
});
