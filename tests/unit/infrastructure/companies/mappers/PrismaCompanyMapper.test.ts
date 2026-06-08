import { Company as PrismaCompany } from '@/infrastructure/prisma/generated/prisma/client';
import { CompanyCreateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import { PrismaCompanyMapper } from '@/infrastructure/companies/mappers/PrismaCompanyMapper';
import { Company } from '@/domain/companies/entities/Company';

describe('PrismaCompanyMapper', () => {
  const mockPrismaRow: PrismaCompany = {
    id: 'company-uuid-1',
    name: 'Test Company SL',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  describe('toDomain', () => {
    it('maps all fields correctly from Prisma row to Company entity', () => {
      const company = PrismaCompanyMapper.toDomain(mockPrismaRow);

      expect(company).toBeInstanceOf(Company);
      expect(company.id).toBe(mockPrismaRow.id);
      expect(company.name).toBe(mockPrismaRow.name);
    });

    it('converts createdAt date to ISO string', () => {
      const company = PrismaCompanyMapper.toDomain(mockPrismaRow);

      expect(company.createdAt).toBeInstanceOf(Date);
      expect(company.createdAt.toISOString()).toBe('2024-01-15T10:00:00.000Z');
    });

    it('converts updatedAt date to ISO string', () => {
      const company = PrismaCompanyMapper.toDomain(mockPrismaRow);

      expect(company.updatedAt).toBeInstanceOf(Date);
      expect(company.updatedAt.toISOString()).toBe('2024-01-15T12:00:00.000Z');
    });
  });

  describe('toPersistence', () => {
    it('returns correct CompanyCreateArgs with data object', () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company SL',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: CompanyCreateArgs = PrismaCompanyMapper.toPersistence(domainCompany);

      expect(result.data).toEqual({
        id: 'company-uuid-1',
        name: 'Test Company SL',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('uses company.id as plain string (not value object)', () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company SL',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: CompanyCreateArgs = PrismaCompanyMapper.toPersistence(domainCompany);

      expect(typeof result.data.id).toBe('string');
      expect(result.data.id).toBe('company-uuid-1');
    });
  });
});
