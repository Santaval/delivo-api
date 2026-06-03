import { OrderStatus, OrderStatusType } from '@/domain/orders/valueObjects/orderStatus.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('OrderStatus', () => {
  it('should create OrderStatus with PENDING value', () => {
    const status = OrderStatus.create('PENDING');

    expect(status.value).toBe('PENDING');
  });

  it('should create OrderStatus with PAID value', () => {
    const status = OrderStatus.create('PAID');

    expect(status.value).toBe('PAID');
  });

  it('should create OrderStatus with CANCELLED value', () => {
    const status = OrderStatus.create('CANCELLED');

    expect(status.value).toBe('CANCELLED');
  });

  it('should create status using pending factory', () => {
    const status = OrderStatus.pending();

    expect(status.value).toBe('PENDING');
    expect(status.isPending()).toBe(true);
  });

  it('should create status using paid factory', () => {
    const status = OrderStatus.paid();

    expect(status.value).toBe('PAID');
    expect(status.isPaid()).toBe(true);
  });

  it('should create status using cancelled factory', () => {
    const status = OrderStatus.cancelled();

    expect(status.value).toBe('CANCELLED');
    expect(status.isCancelled()).toBe(true);
  });

  it('should return correct value for isPending', () => {
    const pending = OrderStatus.pending();
    const paid = OrderStatus.paid();

    expect(pending.isPending()).toBe(true);
    expect(paid.isPending()).toBe(false);
  });

  it('should return correct value for isPaid', () => {
    const pending = OrderStatus.pending();
    const paid = OrderStatus.paid();

    expect(paid.isPaid()).toBe(true);
    expect(pending.isPaid()).toBe(false);
  });

  it('should return correct value for isCancelled', () => {
    const cancelled = OrderStatus.cancelled();
    const pending = OrderStatus.pending();

    expect(cancelled.isCancelled()).toBe(true);
    expect(pending.isCancelled()).toBe(false);
  });

  it('should check equality with equals', () => {
    const status1 = OrderStatus.create('PENDING');
    const status2 = OrderStatus.create('PENDING');
    const status3 = OrderStatus.create('PAID');

    expect(status1.equals(status2)).toBe(true);
    expect(status1.equals(status3)).toBe(false);
  });

  it('should return correct string representation', () => {
    const status = OrderStatus.create('PENDING');

    expect(status.toString()).toBe('PENDING');
  });

  describe('canTransitionTo', () => {
    it('should allow PENDING to transition to PAID', () => {
      const pending = OrderStatus.pending();
      const paid = OrderStatus.paid();

      expect(pending.canTransitionTo(paid)).toBe(true);
    });

    it('should allow PENDING to transition to CANCELLED', () => {
      const pending = OrderStatus.pending();
      const cancelled = OrderStatus.cancelled();

      expect(pending.canTransitionTo(cancelled)).toBe(true);
    });

    it('should not allow PAID to transition to any status', () => {
      const paid = OrderStatus.paid();
      const cancelled = OrderStatus.cancelled();

      expect(paid.canTransitionTo(cancelled)).toBe(false);
    });

    it('should not allow CANCELLED to transition to any status', () => {
      const cancelled = OrderStatus.cancelled();
      const paid = OrderStatus.paid();

      expect(cancelled.canTransitionTo(paid)).toBe(false);
    });
  });

  it('should throw DomainError for invalid status', () => {
    expect(() => OrderStatus.create('INVALID')).toThrow(DomainError);
    expect(() => OrderStatus.create('INVALID')).toThrow('Invalid order status');
  });
});