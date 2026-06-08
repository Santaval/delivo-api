import { OrderTotal } from '@/domain/orders/valueObjects/orderTotal.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('OrderTotal', () => {
  it('should create OrderTotal with valid values', () => {
    const total = OrderTotal.create(100, 13, 0);

    expect(total.subtotal).toBe(100);
    expect(total.ivaTotal).toBe(13);
    expect(total.total).toBe(113);
    expect(total.paid).toBe(0);
    expect(total.due).toBe(113);
  });

  it('should calculate total as subtotal + ivaTotal', () => {
    const total = OrderTotal.create(200, 26, 0);

    expect(total.total).toBe(226);
  });

  it('should calculate due as total - paid', () => {
    const total = OrderTotal.create(100, 13, 50);

    expect(total.due).toBe(63);
  });

  it('should handle full payment', () => {
    const total = OrderTotal.create(100, 13, 113);

    expect(total.due).toBe(0);
  });

  it('should return correct string representation', () => {
    const total = OrderTotal.create(100, 13, 50);

    expect(total.toString()).toBe('Subtotal: 100, IVA: 13, Total: 113');
  });

  it('should throw DomainError when subtotal is negative', () => {
    expect(() => OrderTotal.create(-100, 13, 0)).toThrow(DomainError);
    expect(() => OrderTotal.create(-100, 13, 0)).toThrow('Subtotal cannot be negative');
  });

  it('should throw DomainError when ivaTotal is negative', () => {
    expect(() => OrderTotal.create(100, -13, 0)).toThrow(DomainError);
    expect(() => OrderTotal.create(100, -13, 0)).toThrow('IVA total cannot be negative');
  });

  it('should throw DomainError when paid is negative', () => {
    expect(() => OrderTotal.create(100, 13, -50)).toThrow(DomainError);
    expect(() => OrderTotal.create(100, 13, -50)).toThrow('Due cannot be negative');
  });

  it('should handle zero values', () => {
    const total = OrderTotal.create(0, 0, 0);

    expect(total.subtotal).toBe(0);
    expect(total.ivaTotal).toBe(0);
    expect(total.total).toBe(0);
    expect(total.paid).toBe(0);
    expect(total.due).toBe(0);
  });
});