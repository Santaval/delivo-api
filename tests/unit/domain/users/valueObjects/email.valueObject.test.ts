import { Email } from '@/domain/users/valueObjects/email.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('Email', () => {
  it('should create an Email with valid value', () => {
    const email = Email.create('user@example.com');

    expect(email.value).toBe('user@example.com');
  });

  it('should convert value to lowercase', () => {
    const email = Email.create('USER@EXAMPLE.COM');

    expect(email.value).toBe('user@example.com');
  });

  it('should trim whitespace from value', () => {
    const email = Email.create('  user@example.com  ');

    expect(email.value).toBe('user@example.com');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => Email.create('')).toThrow(DataException);
    expect(() => Email.create('')).toThrow('Invalid email');
  });

  it('should throw DataException when value does not contain @', () => {
    expect(() => Email.create('userexample.com')).toThrow(DataException);
    expect(() => Email.create('userexample.com')).toThrow('Invalid email');
  });

  it('should allow @ symbol alone (no domain validation)', () => {
    const email = Email.create('@');

    expect(email.value).toBe('@');
  });

  it('should allow @ with no domain part (no domain validation)', () => {
    const email = Email.create('user@');

    expect(email.value).toBe('user@');
  });
});