import { UserCreationError } from '@/application/users/errors/UserCreationError';

describe('UserCreationError', () => {
  it('has correct default values', () => {
    const error = new UserCreationError();

    expect(error.message).toBe('Failed to create user');
    expect(error.name).toBe('UserCreationError');
  });

  it('accepts custom message', () => {
    const error = new UserCreationError('Custom user creation message');

    expect(error.message).toBe('Custom user creation message');
  });
});