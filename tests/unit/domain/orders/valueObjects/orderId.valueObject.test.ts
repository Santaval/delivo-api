import { OrderId } from '@/domain/orders/valueObjects/orderId.valueObject';
import DataError from '@/domain/core/errors/DataError';

describe('OrderId', () => {
  it('should create an OrderId with valid value', () => {
    const orderId = OrderId.create('order-123');

    expect(orderId.value).toBe('order-123');
  });

  it('should return the same value in toString', () => {
    const orderId = OrderId.create('order-456');

    expect(orderId.toString()).toBe('order-456');
  });

  it('should check equality with equals', () => {
    const orderId1 = OrderId.create('order-123');
    const orderId2 = OrderId.create('order-123');
    const orderId3 = OrderId.create('order-456');

    expect(orderId1.equals(orderId2)).toBe(true);
    expect(orderId1.equals(orderId3)).toBe(false);
  });

  it('should throw DataError when value is empty', () => {
    expect(() => OrderId.create('')).toThrow(DataError);
    expect(() => OrderId.create('')).toThrow('OrderId cannot be empty');
  });

  it('should throw DataError when value is only whitespace', () => {
    expect(() => OrderId.create('   ')).toThrow(DataError);
  });
});