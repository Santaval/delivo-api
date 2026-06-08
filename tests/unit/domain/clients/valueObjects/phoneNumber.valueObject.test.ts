import { PhoneNumber } from '@/domain/clients/valueObjects/phoneNumber.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('PhoneNumber', () => {
  it('should create a PhoneNumber with valid value', () => {
    const phoneNumber = PhoneNumber.create('+1234567890');

    expect(phoneNumber.value).toBe('+1234567890');
  });

  it('should trim whitespace from value', () => {
    const phoneNumber = PhoneNumber.create('  +1234567890  ');

    expect(phoneNumber.value).toBe('+1234567890');
  });

  it('should allow phone numbers with 8 digits', () => {
    const phoneNumber = PhoneNumber.create('12345678');

    expect(phoneNumber.value).toBe('12345678');
  });

  it('should allow phone numbers with 15 digits', () => {
    const phoneNumber = PhoneNumber.create('123456789012345');

    expect(phoneNumber.value).toBe('123456789012345');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => PhoneNumber.create('')).toThrow(DataException);
    expect(() => PhoneNumber.create('')).toThrow('Phone number cannot be empty');
  });

  it('should throw DataException when value is only whitespace', () => {
    expect(() => PhoneNumber.create('   ')).toThrow(DataException);
    expect(() => PhoneNumber.create('   ')).toThrow('Phone number cannot be empty');
  });

  it('should throw DataException when phone number has less than 8 digits', () => {
    expect(() => PhoneNumber.create('1234567')).toThrow(DataException);
    expect(() => PhoneNumber.create('1234567')).toThrow('Phone number must have at least 8 digits');
  });

  it('should throw DataException when phone number has more than 15 digits', () => {
    expect(() => PhoneNumber.create('1234567890123456')).toThrow(DataException);
    expect(() => PhoneNumber.create('1234567890123456')).toThrow('Phone number cannot exceed 15 digits');
  });
});