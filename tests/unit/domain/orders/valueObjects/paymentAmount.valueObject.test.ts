import { PaymentAmount } from '@/domain/orders/valueObjects/paymentAmount.valueObject';
import DataError from '@/domain/core/errors/DataError';

describe('PaymentAmount', () => {
  it('should create a PaymentAmount with valid value', () => {
    const amount = PaymentAmount.create(100);

    expect(amount.value).toBe(100);
  });

  it('should create a PaymentAmount with decimal value', () => {
    const amount = PaymentAmount.create(99.99);

    expect(amount.value).toBe(99.99);
  });

  it('should throw DataError when value is zero', () => {
    expect(() => PaymentAmount.create(0)).toThrow(DataError);
    expect(() => PaymentAmount.create(0)).toThrow('Payment amount cannot be negative or zero');
  });

  it('should throw DataError when value is negative', () => {
    expect(() => PaymentAmount.create(-100)).toThrow(DataError);
    expect(() => PaymentAmount.create(-100)).toThrow('Payment amount cannot be negative or zero');
  });
});