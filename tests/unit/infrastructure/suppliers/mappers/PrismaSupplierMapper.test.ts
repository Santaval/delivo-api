import { Supplier as PrismaSupplier } from '@/infrastructure/prisma/generated/prisma/client';
import { SupplierCreateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import { PrismaSupplierMapper } from '@/infrastructure/suppliers/mappers/PrismaSupplierMapper';
import { Supplier } from '@/domain/suppliers/entities/Supplier';

describe('PrismaSupplierMapper', () => {
  const mockPrismaRow: PrismaSupplier = {
    id: 'supplier-uuid-1',
    name: 'Test Supplier',
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  describe('toDomain', () => {
    it('maps all fields correctly from Prisma row to Supplier entity', () => {
      const supplier = PrismaSupplierMapper.toDomain(mockPrismaRow);

      expect(supplier).toBeInstanceOf(Supplier);
      expect(supplier.id).toBe(mockPrismaRow.id);
      expect(supplier.name).toBe(mockPrismaRow.name);
      expect(supplier.companyId).toBe(mockPrismaRow.companyId);
    });

    it('converts createdAt date to ISO string', () => {
      const supplier = PrismaSupplierMapper.toDomain(mockPrismaRow);

      expect(supplier.createdAt).toBeInstanceOf(Date);
      expect(supplier.createdAt.toISOString()).toBe('2024-01-15T10:00:00.000Z');
    });

    it('converts updatedAt date to ISO string', () => {
      const supplier = PrismaSupplierMapper.toDomain(mockPrismaRow);

      expect(supplier.updatedAt).toBeInstanceOf(Date);
      expect(supplier.updatedAt.toISOString()).toBe('2024-01-15T12:00:00.000Z');
    });
  });

  describe('toPersistence', () => {
    it('returns correct SupplierCreateArgs with data object', () => {
      const domainSupplier = new Supplier({
        id: 'supplier-uuid-1',
        name: 'Test Supplier',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: SupplierCreateArgs = PrismaSupplierMapper.toPersistence(domainSupplier);

      expect(result.data).toEqual({
        id: 'supplier-uuid-1',
        name: 'Test Supplier',
        companyId: 'company-uuid-1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('uses supplier.id as plain string', () => {
      const domainSupplier = new Supplier({
        id: 'supplier-uuid-1',
        name: 'Test Supplier',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: SupplierCreateArgs = PrismaSupplierMapper.toPersistence(domainSupplier);

      expect(typeof result.data.id).toBe('string');
      expect(result.data.id).toBe('supplier-uuid-1');
    });
  });
});
