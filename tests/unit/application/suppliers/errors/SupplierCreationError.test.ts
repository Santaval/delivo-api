import { SupplierCreationError } from '@/application/suppliers/errors/SupplierCreationError';

describe('SupplierCreationError', () => {
  it('has correct default values', () => {
    const error = new SupplierCreationError();

    expect(error.message).toBe('Failed to create supplier');
    expect(error.name).toBe('SupplierCreationError');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });

  it('accepts custom message', () => {
    const error = new SupplierCreationError('Custom supplier creation message');

    expect(error.message).toBe('Custom supplier creation message');
  });
});