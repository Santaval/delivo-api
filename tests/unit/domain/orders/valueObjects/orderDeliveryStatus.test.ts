import { OrderDeliveryStatus, OrderDeliveryStatusType } from '@/domain/orders/valueObjects/orderDeliveryStatus';
import DomainError from '@/domain/core/errors/DomainError';

describe('OrderDeliveryStatus', () => {
  it('should create OrderDeliveryStatus with PENDING value', () => {
    const status = OrderDeliveryStatus.create('PENDING');

    expect(status.value).toBe('PENDING');
  });

  it('should create OrderDeliveryStatus with ON_ROUTE value', () => {
    const status = OrderDeliveryStatus.create('ON_ROUTE');

    expect(status.value).toBe('ON_ROUTE');
  });

  it('should create OrderDeliveryStatus with IN_TRANSIT value', () => {
    const status = OrderDeliveryStatus.create('IN_TRANSIT');

    expect(status.value).toBe('IN_TRANSIT');
  });

  it('should create OrderDeliveryStatus with DELIVERED value', () => {
    const status = OrderDeliveryStatus.create('DELIVERED');

    expect(status.value).toBe('DELIVERED');
  });

  it('should create OrderDeliveryStatus with RETURNED value', () => {
    const status = OrderDeliveryStatus.create('RETURNED');

    expect(status.value).toBe('RETURNED');
  });

  it('should throw DomainError for invalid status', () => {
    expect(() => OrderDeliveryStatus.create('INVALID')).toThrow(DomainError);
    expect(() => OrderDeliveryStatus.create('INVALID')).toThrow('Invalid order delivery status');
  });

  it('should throw DomainError for empty status', () => {
    expect(() => OrderDeliveryStatus.create('')).toThrow(DomainError);
  });
});