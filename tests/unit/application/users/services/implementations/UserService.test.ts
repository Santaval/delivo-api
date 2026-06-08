import { UserService } from '@/application/users/services/implementations/UserService';
import { IUserService } from '@/application/users/services/interfaces/IUserService';
import { IUserRepository } from '@/domain/users/repositories/IUserRepository';
import { UserCreationError } from '@/application/users/errors/UserCreationError';
import { createUser } from '@/tests/mocks/domain';

describe('UserService', () => {
  let service: IUserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      all: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<IUserRepository>;
    service = new UserService(mockRepository);
  });

  describe('create', () => {
    it('creates user and returns it', async () => {
      const user = createUser();
      mockRepository.create.mockResolvedValue();
      mockRepository.find.mockResolvedValue(user);

      const result = await service.create(user);

      expect(mockRepository.create).toHaveBeenCalledWith(user);
      expect(result).toBe(user);
    });

    it('throws UserCreationError when user not found after creation', async () => {
      const user = createUser();
      mockRepository.create.mockResolvedValue();
      mockRepository.find.mockResolvedValue(null);

      await expect(service.create(user)).rejects.toThrow(UserCreationError);
    });

    it('throws Error when repository throws during create', async () => {
      const user = createUser();
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(user)).rejects.toThrow(Error);
    });
  });

  describe('find', () => {
    it('finds user by id by default', async () => {
      const user = createUser();
      mockRepository.find.mockResolvedValue(user);

      const result = await service.find('user-1');

      expect(mockRepository.find).toHaveBeenCalledWith('user-1', 'id');
      expect(result).toBe(user);
    });

    it('finds user by custom field', async () => {
      const user = createUser();
      mockRepository.find.mockResolvedValue(user);

      const result = await service.find('test@example.com', 'email');

      expect(mockRepository.find).toHaveBeenCalledWith('test@example.com', 'email');
      expect(result).toBe(user);
    });

    it('returns null when user not found', async () => {
      mockRepository.find.mockResolvedValue(null);

      const result = await service.find('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates user and returns updated version', async () => {
      const user = createUser({ name: 'Updated Name' });
      const updatedUser = createUser({ name: 'Updated Name' });
      mockRepository.update.mockResolvedValue();
      mockRepository.find.mockResolvedValue(updatedUser);

      const result = await service.update(user);

      expect(mockRepository.update).toHaveBeenCalledWith(user);
      expect(result).toBe(updatedUser);
    });

    it('throws UserCreationError when update fails to return user', async () => {
      const user = createUser();
      mockRepository.update.mockResolvedValue();
      mockRepository.find.mockResolvedValue(null);

      await expect(service.update(user)).rejects.toThrow(UserCreationError);
    });
  });
});