import { ProductId } from '@/domain/products/valueObjects/productId.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('ProductId', () => {
  it('should create a ProductId with valid value', () => {
    const productId = ProductId.create('product-123');

    expect(productId.value).toBe('product-123');
  });

  it('should trim whitespace from value', () => {
    const productId = ProductId.create('  product-456  ');

    expect(productId.value).toBe('product-456');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => ProductId.create('')).toThrow(DataException);
    expect(() => ProductId.create('')).toThrow('ProductId cannot be empty');
  });

  it('should throw DataException when value is only whitespace', () => {
    expect(() => ProductId.create('   ')).toThrow(DataException);
  });
});