import { InvalidCredentialsError } from '@/application/auth/errors/InvalidCredentialsError';

describe('InvalidCredentialsError', () => {
  it('has correct default values', () => {
    const error = new InvalidCredentialsError();

    expect(error.message).toBe('Invalid email or password');
    expect(error.name).toBe('InvalidCredentialsError');
    expect(error.statusCode).toBe(401);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });
});