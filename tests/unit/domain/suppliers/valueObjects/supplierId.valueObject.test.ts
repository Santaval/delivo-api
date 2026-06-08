import { SupplierId } from '@/domain/suppliers/valueObjects/supplierId.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('SupplierId', () => {
  it('should create a SupplierId with valid value', () => {
    const supplierId = SupplierId.create('supplier-123');

    expect(supplierId.value).toBe('supplier-123');
  });

  it('should trim whitespace from value', () => {
    const supplierId = SupplierId.create('  supplier-456  ');

    expect(supplierId.value).toBe('supplier-456');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => SupplierId.create('')).toThrow(DataException);
    expect(() => SupplierId.create('')).toThrow('SupplierId cannot be empty');
  });

  it('should throw DataException when value is only whitespace', () => {
    expect(() => SupplierId.create('   ')).toThrow(DataException);
  });
});