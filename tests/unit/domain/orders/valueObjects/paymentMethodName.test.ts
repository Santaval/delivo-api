import PaymentMethodName from '@/domain/orders/valueObjects/paymentMethodName';
import DataError from '@/domain/core/errors/DataError';

describe('PaymentMethodName', () => {
  it('should create a PaymentMethodName with valid value', () => {
    const name = PaymentMethodName.create('Cash');

    expect(name.value).toBe('Cash');
  });

  it('should trim whitespace from value', () => {
    const name = PaymentMethodName.create('  Credit Card  ');

    expect(name.value).toBe('Credit Card');
  });

  it('should check equality with equals', () => {
    const name1 = PaymentMethodName.create('Cash');
    const name2 = PaymentMethodName.create('Cash');
    const name3 = PaymentMethodName.create('Credit Card');

    expect(name1.equals(name2)).toBe(true);
    expect(name1.equals(name3)).toBe(false);
  });

  it('should return the same value in toString', () => {
    const name = PaymentMethodName.create('Cash');

    expect(name.toString()).toBe('Cash');
  });

  it('should throw DataError when value is empty', () => {
    expect(() => PaymentMethodName.create('')).toThrow(DataError);
    expect(() => PaymentMethodName.create('')).toThrow('PaymentMethodName cannot be empty');
  });

  it('should throw DataError when value is only whitespace', () => {
    expect(() => PaymentMethodName.create('   ')).toThrow(DataError);
    expect(() => PaymentMethodName.create('   ')).toThrow('PaymentMethodName cannot be empty');
  });
});