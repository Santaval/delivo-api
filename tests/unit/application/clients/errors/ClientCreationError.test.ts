import { ClientCreationError } from '@/application/clients/errors/ClientCreationError';

describe('ClientCreationError', () => {
  it('has correct default values', () => {
    const error = new ClientCreationError();

    expect(error.message).toBe('Failed to create client');
    expect(error.name).toBe('ClientCreationError');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });

  it('accepts custom message', () => {
    const error = new ClientCreationError('Custom creation failed message');

    expect(error.message).toBe('Custom creation failed message');
  });
});