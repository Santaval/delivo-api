import OAuthService from '@/application/auth/services/implementations/IOAuthService';
import { IOAuthService } from '@/application/auth/services/interfaces/IOAuthService';
import { IUserService } from '@/application/users/services/interfaces/IUserService';
import { IOAuthProvider, OAuthUserPayload } from '@/domain/auth/providers/IOAuthProvider';
import { IIDGenerator } from '@/domain/core/services/IIDGenerator';
import { User } from '@/domain/users/entities/User';
import { InvalidCredentialsError } from '@/application/auth/errors/InvalidCredentialsError';
import { createUser } from '@/tests/mocks/domain';

describe('OAuthService', () => {
  let service: IOAuthService;
  let mockUserService: jest.Mocked<IUserService>;
  let mockOAuthProvider: jest.Mocked<IOAuthProvider>;
  let mockIdGenerator: jest.Mocked<IIDGenerator>;

  beforeEach(() => {
    mockUserService = {
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<IUserService>;

    mockOAuthProvider = {
      getUserInfo: jest.fn(),
    } as jest.Mocked<IOAuthProvider>;

    mockIdGenerator = {
      generate: jest.fn(),
    } as jest.Mocked<IIDGenerator>;

    service = new OAuthService(mockUserService, mockOAuthProvider, mockIdGenerator);
  });

  describe('google', () => {
    const accessToken = 'valid-access-token';
    const userPayload: OAuthUserPayload = {
      sub: 'google-user-id',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
      email_verified: true,
    };

    it('returns existing user when found by email', async () => {
      const existingUser = createUser({ email: 'test@example.com' });
      mockOAuthProvider.getUserInfo.mockResolvedValue(userPayload);
      mockUserService.find.mockResolvedValue(existingUser);

      const result = await service.google(accessToken);

      expect(mockOAuthProvider.getUserInfo).toHaveBeenCalledWith(accessToken);
      expect(mockUserService.find).toHaveBeenCalledWith('test@example.com', 'email');
      expect(result).toBe(existingUser);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('creates new user when not found by email', async () => {
      const newUser = createUser({ email: 'test@example.com', name: 'Test User' });
      mockOAuthProvider.getUserInfo.mockResolvedValue(userPayload);
      mockUserService.find.mockResolvedValue(null);
      mockIdGenerator.generate.mockReturnValue('generated-id-123');
      mockUserService.create.mockResolvedValue(newUser);

      const result = await service.google(accessToken);

      expect(mockUserService.find).toHaveBeenCalledWith('test@example.com', 'email');
      expect(mockIdGenerator.generate).toHaveBeenCalled();
      expect(mockUserService.create).toHaveBeenCalled();
      expect(result).toBe(newUser);
    });

    it('throws InvalidCredentialsError when getUserInfo fails', async () => {
      mockOAuthProvider.getUserInfo.mockRejectedValue(new Error('Invalid token'));

      await expect(service.google(accessToken)).rejects.toThrow(InvalidCredentialsError);
    });

    it('throws InvalidCredentialsError when find throws', async () => {
      mockOAuthProvider.getUserInfo.mockResolvedValue(userPayload);
      mockUserService.find.mockRejectedValue(new Error('DB error'));

      await expect(service.google(accessToken)).rejects.toThrow(InvalidCredentialsError);
    });
  });
});