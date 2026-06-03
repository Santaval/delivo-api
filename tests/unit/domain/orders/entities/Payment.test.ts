import { createPayment } from '@/tests/mocks/domain';
import moment from 'moment';

describe('Payment', () => {
  it('should create a payment with valid properties', () => {
    const payment = createPayment();

    expect(payment.id.value).toBe('payment-1');
    expect(payment.orderId.value).toBe('order-1');
    expect(payment.amount.value).toBe(100);
    expect(payment.createdAt).toBeInstanceOf(moment);
    expect(payment.updatedAt).toBeInstanceOf(moment);
  });

  it('should create a payment with custom amount', () => {
    const payment = createPayment({ amount: 250 });

    expect(payment.amount.value).toBe(250);
  });

  it('should create a payment with custom orderId', () => {
    const payment = createPayment({ orderId: 'order-99' });

    expect(payment.orderId.value).toBe('order-99');
  });

  it('should parse ISO date strings correctly', () => {
    const payment = createPayment({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(payment.createdAt).toEqual(moment('2023-06-15T10:30:00.000Z'));
    expect(payment.updatedAt).toEqual(moment('2023-06-15T10:30:00.000Z'));
  });

  it('should throw when created with empty id', () => {
    expect(() => createPayment({ id: '' })).toThrow();
  });

  it('should throw when created with empty orderId', () => {
    expect(() => createPayment({ orderId: '' })).toThrow();
  });

  it('should throw when created with negative amount', () => {
    expect(() => createPayment({ amount: -50 })).toThrow();
  });
});