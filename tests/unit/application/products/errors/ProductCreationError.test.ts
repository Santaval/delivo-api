import { ProductCreationError } from '@/application/products/errors/ProductCreationError';

describe('ProductCreationError', () => {
  it('has correct default values', () => {
    const error = new ProductCreationError();

    expect(error.message).toBe('Failed to create product');
    expect(error.name).toBe('ProductCreationError');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });

  it('accepts custom message', () => {
    const error = new ProductCreationError('Custom product creation message');

    expect(error.message).toBe('Custom product creation message');
  });
});