import { Client } from '@/domain/clients/entities/Client';
import DatabaseError from '@/infrastructure/core/errors/DatabaseError';
import DatabaseInsertError from '@/infrastructure/core/errors/DatabaseInsertError';
import PrismaClientsRepository from '@/infrastructure/clients/repositories/PrismaClientsRepository';
import { PrismaClientMapper } from '@/infrastructure/clients/mappers/PrismaClientMapper';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindFirst = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  return {
    prisma: {
      client: {
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

describe('PrismaClientsRepository', () => {
  let repository: PrismaClientsRepository;

  const mockPrismaRow = {
    id: 'client-uuid-1',
    name: 'Test Client',
    phoneNumber: '1234567890',
    email: 'test@example.com',
    lat: '41.387917',
    lng: '2.112892',
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    deletedAt: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaClientsRepository();
  });

  describe('all', () => {
    it('returns array of Client entities from database', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.all();

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Client);
      expect(result[0].id.value).toBe(mockPrismaRow.id);
      expect(mockFindMany).toHaveBeenCalledWith({ where: { deletedAt: null } });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.all()).rejects.toThrow(DatabaseError);
    });
  });

  describe('find', () => {
    it('returns Client when found by id', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.find('client-uuid-1');

      expect(result).toBeInstanceOf(Client);
      expect(result?.id.value).toBe(mockPrismaRow.id);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: 'client-uuid-1', deletedAt: null },
      });
    });

    it('returns null when client not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.find('non-existent-id');

      expect(result).toBeNull();
    });

    it('uses custom field when specified', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      await repository.find('test@example.com', 'email');

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.find('client-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('creates client and returns mapped entity', async () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        phoneNumber: '1234567890',
        email: 'test@example.com',
        lat: 41.387917,
        lng: 2.112892,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockCreate.mockResolvedValue(mockPrismaRow);

      const result = await repository.create(domainClient);

      expect(result).toBeInstanceOf(Client);
      expect(mockCreate).toHaveBeenCalledWith(
        PrismaClientMapper.toPersistence(domainClient)
      );
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        lat: 41.387917,
        lng: 2.112892,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockCreate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.create(domainClient)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('update', () => {
    it('updates client with correct arguments', async () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Updated Client',
        phoneNumber: '9876543210',
        email: 'updated@example.com',
        lat: 41.387917,
        lng: 2.112892,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockUpdate.mockResolvedValue(mockPrismaRow);

      await repository.update(domainClient);

      expect(mockUpdate).toHaveBeenCalledWith(
        PrismaClientMapper.toPersistenceUpdate(domainClient)
      );
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Updated Client',
        lat: 41.387917,
        lng: 2.112892,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.update(domainClient)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('delete', () => {
    it('soft-deletes client by setting deletedAt', async () => {
      mockUpdate.mockResolvedValue(mockPrismaRow);

      await repository.delete('client-uuid-1');

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: 'client-uuid-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('throws DatabaseInsertError on failure', async () => {
      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.delete('client-uuid-1')).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('findByCompanyId', () => {
    it('returns array of clients for company', async () => {
      mockFindMany.mockResolvedValue([mockPrismaRow]);

      const result = await repository.findByCompanyId('company-uuid-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Client);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { companyId: 'company-uuid-1', deletedAt: null },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findByCompanyId('company-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('findByEmail', () => {
    it('returns client when found by email', async () => {
      mockFindFirst.mockResolvedValue(mockPrismaRow);

      const result = await repository.findByEmail('test@example.com');

      expect(result).toBeInstanceOf(Client);
      expect(result?.email?.value).toBe('test@example.com');
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com', deletedAt: null },
      });
    });

    it('returns null when client not found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findByEmail('test@example.com')).rejects.toThrow(DatabaseError);
    });
  });

  describe('findSoftDeleted', () => {
    const softDeletedRow = { ...mockPrismaRow, deletedAt: new Date('2024-02-01T00:00:00Z') };

    it('returns soft-deleted client matching name and companyId', async () => {
      mockFindFirst.mockResolvedValue(softDeletedRow);

      const result = await repository.findSoftDeleted('Test Client', 'company-uuid-1');

      expect(result).toBeInstanceOf(Client);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          companyId: 'company-uuid-1',
          deletedAt: { not: null },
          OR: [{ name: 'Test Client' }],
        },
      });
    });

    it('includes phoneNumber in OR clause when provided', async () => {
      mockFindFirst.mockResolvedValue(softDeletedRow);

      await repository.findSoftDeleted('Test Client', 'company-uuid-1', '1234567890');

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          companyId: 'company-uuid-1',
          deletedAt: { not: null },
          OR: [{ name: 'Test Client' }, { phoneNumber: '1234567890' }],
        },
      });
    });

    it('returns null when no soft-deleted client found', async () => {
      mockFindFirst.mockResolvedValue(null);

      const result = await repository.findSoftDeleted('No Client', 'company-uuid-1');

      expect(result).toBeNull();
    });

    it('throws DatabaseError on failure', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findSoftDeleted('Test Client', 'company-uuid-1')).rejects.toThrow(DatabaseError);
    });
  });

  describe('restore', () => {
    it('restores soft-deleted client and returns updated entity', async () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Restored Client',
        phoneNumber: '1234567890',
        email: 'restored@example.com',
        lat: 41.387917,
        lng: 2.112892,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const restoredRow = { ...mockPrismaRow, name: 'Restored Client', deletedAt: null };
      mockUpdate.mockResolvedValue(restoredRow);
      mockFindFirst.mockResolvedValue(restoredRow);

      const result = await repository.restore('client-uuid-1', domainClient);

      expect(result).toBeInstanceOf(Client);
      expect(mockUpdate).toHaveBeenCalledWith(
        PrismaClientMapper.toPersistenceRestore('client-uuid-1', domainClient)
      );
      expect(mockFindFirst).toHaveBeenCalledWith({ where: { id: 'client-uuid-1' } });
    });

    it('throws DatabaseInsertError on failure', async () => {
      const domainClient = new Client({
        id: 'client-uuid-1',
        name: 'Restored Client',
        lat: 41.387917,
        lng: 2.112892,
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      mockUpdate.mockRejectedValue(new Error('DB Error'));

      await expect(repository.restore('client-uuid-1', domainClient)).rejects.toThrow(DatabaseInsertError);
    });
  });
});
