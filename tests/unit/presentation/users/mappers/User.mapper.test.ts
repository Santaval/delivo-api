import { User } from '@/domain/users/entities/User';
import { Company } from '@/domain/companies/entities/Company';
import UserDtoMapper from '@/presentation/users/mappers/User.mapper';
import { UpdateUserRequest } from '@/presentation/users/requests/UpdateUserRequest';

describe('UserDtoMapper', () => {
  const createUser = (overrides?: Partial<any>): User =>
    new User({
      id: 'user-1',
      name: 'Juan',
      surnames: 'Pérez',
      email: 'juan@test.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      companies: [],
      ...overrides,
    });

  describe('fromUpdateRequestToEntity', () => {
    it('should map UpdateUserRequest to User', () => {
      const request: UpdateUserRequest = { id: 'user-1', name: 'Updated', surnames: 'García' };
      const user = UserDtoMapper.fromUpdateRequestToEntity(request);
      expect(user).toBeInstanceOf(User);
      expect(user.name).toBe('Updated');
      expect(user.surnames).toBe('García');
    });
  });

  describe('toResponse', () => {
    it('should map User to UserResponse', () => {
      const user = createUser();
      const response = UserDtoMapper.toResponse(user);
      expect(response.id).toBe('user-1');
      expect(response.name).toBe('Juan');
      expect(response.email).toBe('juan@test.com');
      expect(response.companies).toEqual([]);
    });

    it('should include companies in response', () => {
      const company = new Company({
        id: 'comp-1',
        name: 'Test Co',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const user = createUser({ companies: [company] });
      const response = UserDtoMapper.toResponse(user);
      expect(response.companies).toHaveLength(1);
      expect(response.companies[0].name).toBe('Test Co');
    });
  });

  describe('toMyProfileResponse', () => {
    it('should map User to MyProfileResponse', () => {
      const user = createUser();
      const response = UserDtoMapper.toMyProfileResponse(user);
      expect(response.id).toBe('user-1');
      expect(response.name).toBe('Juan');
    });
  });
});
