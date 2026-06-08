import { Company } from '@/domain/companies/entities/Company';
import DatabaseError from '@/infrastructure/core/errors/DatabaseError';
import DatabaseInsertError from '@/infrastructure/core/errors/DatabaseInsertError';
import PrismaCompaniesRepository from '@/infrastructure/companies/repositories/PrismaCompaniesRepository';
import { PrismaCompanyMapper } from '@/infrastructure/companies/mappers/PrismaCompanyMapper';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindFirst = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  return {
    prisma: {
      company: {
        findMany: mockFindMany,
        findFirst: mockFindFirst,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
      userCompany: {
        create: jest.fn(),
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

describe('PrismaCompaniesRepository', () => {
  let repository: PrismaCompaniesRepository;

  const mockPrismaRow = {
    id: 'company-uuid-1',
    name: 'Test Company SL',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaCompaniesRepository();
  });

  describe('all', () => {
    it('returns array of Company entities from database', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.all();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Company);
      expect(result[0].id).toBe(mockPrismaRow.id);
      expect(mockFindMany).toHaveBeenCalledWith();
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.all()).rejects.toThrow(DatabaseError);
    });
  });

  describe('find', () => {
    it('returns Company when found by id', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('company-uuid-1');

      expect(result).toBeInstanceOf(Company);
      expect(result?.id).toBe(mockPrismaRow.id);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'company-uuid-1' },
      });
    });

    it('returns null when company not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.find('non-existent-id');

      expect(result).toBeNull();
    });

    it('uses custom field when specified', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('Test Company SL', 'name');

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { name: 'Test Company SL' },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.find('company-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('creates company and returns void', async () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company SL',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockCreate.mockResolvedValue(mockPrismaRow);

      await repository.create(domainCompany);

      expect(mockCreate).toHaveBeenCalledWith(
        PrismaCompanyMapper.toPersistence(domainCompany)
      );
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company SL',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.create(domainCompany)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('update', () => {
    it('updates company with correct arguments', async () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Updated Company SL',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      mockUpdate.mockResolvedValue(mockPrismaRow);

      await repository.update(domainCompany);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'company-uuid-1' },
        data: PrismaCompanyMapper.toPersistence(domainCompany).data,
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Updated Company SL',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.update(domainCompany)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('delete', () => {
    it('deletes company with correct companyId', async () => {
      mockDelete.mockResolvedValue(mockPrismaRow);

      await repository.delete('company-uuid-1');

      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 'company-uuid-1' },
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      mockDelete.mockRejectedValue(new Error('DB Error'));

      await expect(repository.delete('company-uuid-1')).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('addUser', () => {
    it('creates UserCompany relationship with OWNER role', async () => {
      const { prisma } = jest.requireMock('@/infrastructure/prisma/client');
      const mockUserCompanyCreate = prisma.userCompany.create as jest.Mock;
      mockUserCompanyCreate.mockResolvedValue({});

      await repository.addUser('company-uuid-1', 'user-uuid-1');

      expect(mockUserCompanyCreate).toHaveBeenCalledWith({
        data: {
          company: { connect: { id: 'company-uuid-1' } },
          user: { connect: { id: 'user-uuid-1' } },
          role: 'OWNER',
        },
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      const { prisma } = jest.requireMock('@/infrastructure/prisma/client');
      const mockUserCompanyCreate = prisma.userCompany.create as jest.Mock;
      mockUserCompanyCreate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.addUser('company-uuid-1', 'user-uuid-1')).rejects.toThrow(
        DatabaseInsertError
      );
    });
  });
});
