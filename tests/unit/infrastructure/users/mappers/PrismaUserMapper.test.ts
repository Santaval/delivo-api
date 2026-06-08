import { Company as PrismaCompany, User as PrismaUser } from '@/infrastructure/prisma/generated/prisma/client';
import { UserCreateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import { PrismaUserMapper } from '@/infrastructure/users/mappers/PrismaUserMapper';
import { User } from '@/domain/users/entities/User';
import { Company } from '@/domain/companies/entities/Company';

describe('PrismaUserMapper', () => {
  const mockCompany: PrismaCompany = {
    id: 'company-uuid-1',
    name: 'Test Company',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  const mockUserCompanyRegistry = {
    id: 'uc-uuid-1',
    userId: 'user-uuid-1',
    companyId: 'company-uuid-1',
    company: mockCompany,
    role: 'OWNER',
  };

  const mockPrismaRow: PrismaUser & { companies: (typeof mockUserCompanyRegistry)[] } = {
    id: 'user-uuid-1',
    name: 'Test',
    surnames: 'User',
    email: 'test@example.com',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    companies: [mockUserCompanyRegistry],
  };

  describe('toDomain', () => {
    it('maps all fields correctly from Prisma row to User entity', () => {
      const user = PrismaUserMapper.toDomain(mockPrismaRow);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(mockPrismaRow.id);
      expect(user.name).toBe(mockPrismaRow.name);
      expect(user.surnames).toBe(mockPrismaRow.surnames);
    });

    it('maps companies from registry', () => {
      const user = PrismaUserMapper.toDomain(mockPrismaRow);

      expect(user.companies).toHaveLength(1);
      expect(user.companies[0]).toBeInstanceOf(Company);
      expect(user.companies[0].id).toBe(mockCompany.id);
    });

    it('converts createdAt date to ISO string', () => {
      const user = PrismaUserMapper.toDomain(mockPrismaRow);

      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('toPersistence', () => {
    it('returns correct UserCreateArgs with data object', () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const domainUser = new User({
        id: 'user-uuid-1',
        name: 'Test',
        surnames: 'User',
        email: 'test@example.com',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
        companies: [domainCompany],
      });

      const result: UserCreateArgs = PrismaUserMapper.toPersistence(domainUser);

      expect(result.data).toEqual({
        id: 'user-uuid-1',
        name: 'Test',
        surnames: 'User',
        email: 'test@example.com',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('uses user.email.value as plain string', () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const domainUser = new User({
        id: 'user-uuid-1',
        name: 'Test',
        surnames: 'User',
        email: 'test@example.com',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
        companies: [domainCompany],
      });

      const result: UserCreateArgs = PrismaUserMapper.toPersistence(domainUser);

      expect(typeof result.data.email).toBe('string');
      expect(result.data.email).toBe('test@example.com');
    });
  });
});
