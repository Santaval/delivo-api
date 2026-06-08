import { ClientService } from '@/application/clients/services/implementations/ClientService';
import { IClientService } from '@/application/clients/services/interfaces/IClientService';
import { IClientRepository } from '@/domain/clients/repositories/IClientRepository';
import { ClientCreationError } from '@/application/clients/errors/ClientCreationError';
import { ClientNotFoundError } from '@/application/clients/errors/ClientNotFoundError';
import { createClient } from '@/tests/mocks/domain';

describe('ClientService', () => {
  let service: IClientService;
  let mockRepository: jest.Mocked<IClientRepository>;

  beforeEach(() => {
    mockRepository = {
      all: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCompanyId: jest.fn(),
      findByEmail: jest.fn(),
      findSoftDeleted: jest.fn(),
      restore: jest.fn(),
    };
    service = new ClientService(mockRepository);
  });

  describe('create', () => {
    it('creates client and returns it', async () => {
      const client = createClient();
      mockRepository.create.mockResolvedValue(client);

      const result = await service.create(client);

      expect(mockRepository.create).toHaveBeenCalledWith(client);
      expect(result).toBe(client);
    });

    it('throws ClientCreationError when repository returns null', async () => {
      const client = createClient();
      mockRepository.create.mockResolvedValue(null as unknown as ReturnType<typeof mockRepository.create>);

      await expect(service.create(client)).rejects.toThrow(ClientCreationError);
    });

    it('throws Error when repository throws during create', async () => {
      const client = createClient();
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(client)).rejects.toThrow(Error);
    });
  });

  describe('find', () => {
    it('finds client by id by default', async () => {
      const client = createClient();
      mockRepository.find.mockResolvedValue(client);

      const result = await service.find('client-1');

      expect(mockRepository.find).toHaveBeenCalledWith('client-1', 'id');
      expect(result).toBe(client);
    });

    it('finds client by custom field', async () => {
      const client = createClient();
      mockRepository.find.mockResolvedValue(client);

      const result = await service.find('test@example.com', 'email');

      expect(mockRepository.find).toHaveBeenCalledWith('test@example.com', 'email');
      expect(result).toBe(client);
    });

    it('returns null when client not found', async () => {
      mockRepository.find.mockResolvedValue(null);

      const result = await service.find('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates client and returns updated version', async () => {
      const client = createClient({ name: 'Updated Name' });
      const updatedClient = createClient({ name: 'Updated Name' });
      mockRepository.find.mockResolvedValue(client);
      mockRepository.update.mockResolvedValue();
      mockRepository.find.mockResolvedValue(updatedClient);

      const result = await service.update(client);

      expect(mockRepository.update).toHaveBeenCalledWith(client);
      expect(result).toBe(updatedClient);
    });

it('throws ClientNotFoundError when client does not exist', async () => {
      const client = createClient();
      mockRepository.find.mockResolvedValue(null);

      await expect(service.update(client)).rejects.toThrow(ClientNotFoundError);
    });

    it('throws ClientCreationError when update fails to return client', async () => {
      const client = createClient();
      mockRepository.find
        .mockResolvedValueOnce(client)  // first call - client found
        .mockResolvedValueOnce(null);   // second call - client not found after update
      mockRepository.update.mockResolvedValue();

      await expect(service.update(client)).rejects.toThrow(ClientCreationError);
    });
  });

  describe('delete', () => {
    it('deletes existing client', async () => {
      const client = createClient();
      mockRepository.find.mockResolvedValue(client);
      mockRepository.delete.mockResolvedValue();

      await service.delete('client-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('client-1');
    });

    it('throws ClientNotFoundError when client does not exist', async () => {
      mockRepository.find.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(ClientNotFoundError);
    });
  });

  describe('findAll', () => {
    it('returns all clients', async () => {
      const clients = [createClient(), createClient({ id: 'client-2' })];
      mockRepository.all.mockResolvedValue(clients);

      const result = await service.findAll();

      expect(mockRepository.all).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('findByCompanyId', () => {
    it('returns clients for company', async () => {
      const clients = [createClient(), createClient({ id: 'client-2', companyId: 'company-1' })];
      mockRepository.findByCompanyId.mockResolvedValue(clients);

      const result = await service.findByCompanyId('company-1');

      expect(mockRepository.findByCompanyId).toHaveBeenCalledWith('company-1');
      expect(result).toHaveLength(2);
    });
  });

  describe('findByEmail', () => {
    it('returns client found by email', async () => {
      const client = createClient();
      mockRepository.findByEmail.mockResolvedValue(client);

      const result = await service.findByEmail('test@example.com');

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toBe(client);
    });

    it('returns null when client not found by email', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });
});