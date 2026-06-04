import { User } from '@/domain/users/entities/User';
import { Company } from '@/domain/companies/entities/Company';
import DatabaseError from '@/infrastructure/core/errors/DatabaseError';
import DatabaseInsertError from '@/infrastructure/core/errors/DatabaseInsertError';
import PrismaUsersRepository from '@/infrastructure/users/repositories/PrismaUsersRepository';
import { PrismaUserMapper } from '@/infrastructure/users/mappers/PrismaUserMapper';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindFirst = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();

  return {
    prisma: {
      user: {
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

describe('PrismaUsersRepository', () => {
  let repository: PrismaUsersRepository;

  const mockPrismaRow = {
    id: 'user-uuid-1',
    name: 'Test',
    surnames: 'User',
    email: 'test@example.com',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    companies: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaUsersRepository();
  });

  describe('all', () => {
    it('returns array of User entities from database', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.all();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[0].id).toBe(mockPrismaRow.id);
      expect(mockFindMany).toHaveBeenCalledWith({ include: repository.getIncludes() });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.all()).rejects.toThrow(DatabaseError);
    });
  });

  describe('find', () => {
    it('returns User when found by id', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('user-uuid-1');

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe(mockPrismaRow.id);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        include: repository.getIncludes(),
      });
    });

    it('returns null when user not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.find('non-existent-id');

      expect(result).toBeNull();
    });

    it('uses custom field when specified', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('test@example.com', 'email');

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: repository.getIncludes(),
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.find('user-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('creates user', async () => {
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

      await repository.create(domainUser);

      expect(mockCreate).toHaveBeenCalledWith(
        PrismaUserMapper.toPersistence(domainUser)
      );
    });

    it('throws DatabaseInsertError on failure', async () => {
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

      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.create(domainUser)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('update', () => {
    it('updates user with correct arguments', async () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const domainUser = new User({
        id: 'user-uuid-1',
        name: 'Updated',
        surnames: 'User',
        email: 'updated@example.com',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
        companies: [domainCompany],
      });

      mockUpdate.mockResolvedValue(mockPrismaRow);

      await repository.update(domainUser);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'user-uuid-1' },
        data: PrismaUserMapper.toPersistence(domainUser),
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainCompany = new Company({
        id: 'company-uuid-1',
        name: 'Test Company',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const domainUser = new User({
        id: 'user-uuid-1',
        name: 'Updated',
        surnames: 'User',
        email: 'updated@example.com',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
        companies: [domainCompany],
      });

      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.update(domainUser)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('getIncludes', () => {
    it('returns correct include structure for companies', () => {
      const includes = repository.getIncludes();

      expect(includes).toEqual({
        companies: {
          include: {
            company: true,
          },
        },
      });
    });
  });
});
