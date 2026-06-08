import { SupplierNotFoundError } from '@/application/suppliers/errors/SupplierNotFoundError';

describe('SupplierNotFoundError', () => {
  it('has correct default values', () => {
    const error = new SupplierNotFoundError();

    expect(error.message).toBe('Supplier not found');
    expect(error.name).toBe('SupplierNotFoundError');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });
});