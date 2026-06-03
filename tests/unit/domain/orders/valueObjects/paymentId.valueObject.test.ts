import { PaymentId } from '@/domain/orders/valueObjects/paymentId.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('PaymentId', () => {
  it('should create a PaymentId with valid value', () => {
    const paymentId = PaymentId.create('payment-123');

    expect(paymentId.value).toBe('payment-123');
  });

  it('should return the same value in toString', () => {
    const paymentId = PaymentId.create('payment-456');

    expect(paymentId.toString()).toBe('payment-456');
  });

  it('should check equality with equals', () => {
    const paymentId1 = PaymentId.create('payment-123');
    const paymentId2 = PaymentId.create('payment-123');
    const paymentId3 = PaymentId.create('payment-456');

    expect(paymentId1.equals(paymentId2)).toBe(true);
    expect(paymentId1.equals(paymentId3)).toBe(false);
  });

  it('should throw DomainError when value is empty', () => {
    expect(() => PaymentId.create('')).toThrow(DomainError);
    expect(() => PaymentId.create('')).toThrow('PaymentId cannot be empty');
  });

  it('should throw DomainError when value is only whitespace', () => {
    expect(() => PaymentId.create('   ')).toThrow(DomainError);
  });
});