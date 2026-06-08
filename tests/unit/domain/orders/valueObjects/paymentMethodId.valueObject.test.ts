import { PaymentMethodId } from '@/domain/orders/valueObjects/paymentMethodId.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('PaymentMethodId', () => {
  it('should create a PaymentMethodId with valid value', () => {
    const paymentMethodId = PaymentMethodId.create('payment-method-123');

    expect(paymentMethodId.value).toBe('payment-method-123');
  });

  it('should return the same value in toString', () => {
    const paymentMethodId = PaymentMethodId.create('payment-method-456');

    expect(paymentMethodId.toString()).toBe('payment-method-456');
  });

  it('should check equality with equals', () => {
    const paymentMethodId1 = PaymentMethodId.create('payment-method-123');
    const paymentMethodId2 = PaymentMethodId.create('payment-method-123');
    const paymentMethodId3 = PaymentMethodId.create('payment-method-456');

    expect(paymentMethodId1.equals(paymentMethodId2)).toBe(true);
    expect(paymentMethodId1.equals(paymentMethodId3)).toBe(false);
  });

  it('should throw DomainError when value is empty', () => {
    expect(() => PaymentMethodId.create('')).toThrow(DomainError);
    expect(() => PaymentMethodId.create('')).toThrow('PaymentMethodId cannot be empty');
  });

  it('should throw DomainError when value is only whitespace', () => {
    expect(() => PaymentMethodId.create('   ')).toThrow(DomainError);
  });
});