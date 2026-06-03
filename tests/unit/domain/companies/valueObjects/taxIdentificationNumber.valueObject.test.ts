import { TaxIdentificationNumber } from '@/domain/companies/valueObjects/taxIdentificationNumber.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('TaxIdentificationNumber', () => {
  it('should create a TaxIdentificationNumber with valid value', () => {
    const tin = TaxIdentificationNumber.create('ABC123456');

    expect(tin.value).toBe('ABC123456');
  });

  it('should convert value to uppercase', () => {
    const tin = TaxIdentificationNumber.create('abc123456');

    expect(tin.value).toBe('ABC123456');
  });

  it('should trim whitespace from value', () => {
    const tin = TaxIdentificationNumber.create('  ABC123456  ');

    expect(tin.value).toBe('ABC123456');
  });

  it('should create a TaxIdentificationNumber with minimum valid length', () => {
    const tin = TaxIdentificationNumber.create('12345');

    expect(tin.value).toBe('12345');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => TaxIdentificationNumber.create('')).toThrow(DataException);
    expect(() => TaxIdentificationNumber.create('')).toThrow('Tax identification number cannot be empty');
  });

  it('should throw DataException when value is only whitespace', () => {
    expect(() => TaxIdentificationNumber.create('   ')).toThrow(DataException);
    expect(() => TaxIdentificationNumber.create('   ')).toThrow('Tax identification number cannot be empty');
  });

  it('should throw DataException when value is less than 5 characters', () => {
    expect(() => TaxIdentificationNumber.create('1234')).toThrow(DataException);
    expect(() => TaxIdentificationNumber.create('1234')).toThrow('Tax identification number must be at least 5 characters');
  });
});