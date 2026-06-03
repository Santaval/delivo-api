import { createPaymentMethod } from '@/tests/mocks/domain';

describe('PaymentMethod', () => {
  it('should create a payment method with valid properties', () => {
    const paymentMethod = createPaymentMethod();

    expect(paymentMethod.id).toBe('payment-method-1');
    expect(paymentMethod.name).toBe('Cash');
    expect(paymentMethod.companyId).toBe('company-1');
    expect(paymentMethod.createdAt).toBeInstanceOf(Date);
    expect(paymentMethod.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a payment method with custom name', () => {
    const paymentMethod = createPaymentMethod({ name: 'Credit Card' });

    expect(paymentMethod.name).toBe('Credit Card');
  });

  it('should create a payment method with custom companyId', () => {
    const paymentMethod = createPaymentMethod({ companyId: 'company-99' });

    expect(paymentMethod.companyId).toBe('company-99');
  });

  it('should create a payment method with provided dates', () => {
    const paymentMethod = createPaymentMethod({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(paymentMethod.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(paymentMethod.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should use default dates when not provided', () => {
    const paymentMethod = createPaymentMethod({
      createdAt: undefined,
      updatedAt: undefined,
    });

    expect(paymentMethod.createdAt).toBeInstanceOf(Date);
    expect(paymentMethod.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw when created with empty id', () => {
    expect(() => createPaymentMethod({ id: '' })).toThrow();
  });

  it('should throw when created with empty companyId', () => {
    expect(() => createPaymentMethod({ companyId: '' })).toThrow();
  });

  it('should throw when created with empty name', () => {
    expect(() => createPaymentMethod({ name: '' })).toThrow();
  });
});