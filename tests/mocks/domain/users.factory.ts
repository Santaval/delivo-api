import { User } from '@/domain/users/entities/User';
import { UserConstructorProps } from '@/domain/users/entities/User';
import { createCompany } from './companies.factory';

export const createUser = (overrides: Partial<UserConstructorProps> = {}): User => {
  const props: UserConstructorProps = {
    id: 'user-1',
    name: 'Test',
    surnames: 'User',
    email: 'test@example.com',
    companies: [createCompany()],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
  return new User(props);
};