import { UserAlreadyExistsError } from '@/application/users/errors/UserAlreadyExistsError';

describe('UserAlreadyExistsError', () => {
  it('has correct default values', () => {
    const error = new UserAlreadyExistsError();

    expect(error.message).toBe('User already exists');
    expect(error.name).toBe('UserAlreadyExistsError');
    expect(error.statusCode).toBe(409);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });
});