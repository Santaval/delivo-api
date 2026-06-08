import { OrderNumber } from '@/domain/orders/valueObjects/orderNumber.valueObject';
import DataError from '@/domain/core/errors/DataError';

describe('OrderNumber', () => {
  it('should create an OrderNumber with valid value', () => {
    const orderNumber = OrderNumber.create(1001);

    expect(orderNumber.value).toBe(1001);
  });

  it('should check equality with equals', () => {
    const orderNumber1 = OrderNumber.create(1001);
    const orderNumber2 = OrderNumber.create(1001);
    const orderNumber3 = OrderNumber.create(1002);

    expect(orderNumber1.equals(orderNumber2)).toBe(true);
    expect(orderNumber1.equals(orderNumber3)).toBe(false);
  });

  it('should throw DataError when value is zero', () => {
    expect(() => OrderNumber.create(0)).toThrow(DataError);
    expect(() => OrderNumber.create(0)).toThrow('Order number cannot be empty');
  });

  it('should throw DataError when value is negative', () => {
    expect(() => OrderNumber.create(-1)).toThrow(DataError);
    expect(() => OrderNumber.create(-1)).toThrow('Order number must be a positive integer');
  });
});