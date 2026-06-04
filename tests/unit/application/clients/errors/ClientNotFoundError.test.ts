import { ClientNotFoundError } from '@/application/clients/errors/ClientNotFoundError';

describe('ClientNotFoundError', () => {
  it('has correct default values', () => {
    const error = new ClientNotFoundError();

    expect(error.message).toBe('Client not found');
    expect(error.name).toBe('ClientNotFoundError');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });
});