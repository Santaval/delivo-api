import { ProductNotFoundError } from '@/application/products/errors/ProductNotFoundError';

describe('ProductNotFoundError', () => {
  it('has correct default values', () => {
    const error = new ProductNotFoundError();

    expect(error.message).toBe('Product not found');
    expect(error.name).toBe('ProductNotFoundError');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });
});