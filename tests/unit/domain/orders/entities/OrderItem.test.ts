import { createOrderItem } from '@/tests/mocks/domain';

describe('OrderItem', () => {
  it('should create an order item with valid properties', () => {
    const orderItem = createOrderItem();

    expect(orderItem.id).toBe('order-item-1');
    expect(orderItem.name).toBe('Test Order Item');
    expect(orderItem.companyId).toBe('company-1');
    expect(orderItem.pricing.grossPrice).toBe(50);
    expect(orderItem.quantity).toBe(2);
    expect(orderItem.billId).toBe('bill-1');
    expect(orderItem.itemId).toBe('item-1');
    expect(orderItem.createdAt).toBeInstanceOf(Date);
    expect(orderItem.updatedAt).toBeInstanceOf(Date);
  });

  it('should inherit Product properties', () => {
    const orderItem = createOrderItem({
      grossPrice: 100,
      ivaRate: 13,
    });

    expect(orderItem.pricing.grossPrice).toBe(100);
    expect(orderItem.pricing.ivaRate).toBe(13);
    expect(orderItem.ivaAmount).toBeCloseTo(11.50, 1);
  });

  it('should create an order item with custom quantity', () => {
    const orderItem = createOrderItem({ quantity: 5 });

    expect(orderItem.quantity).toBe(5);
  });

  it('should create an order item with custom billId', () => {
    const orderItem = createOrderItem({ billId: 'bill-99' });

    expect(orderItem.billId).toBe('bill-99');
  });

  it('should create an order item with custom itemId', () => {
    const orderItem = createOrderItem({ itemId: 'item-99' });

    expect(orderItem.itemId).toBe('item-99');
  });

  it('should parse ISO date strings correctly', () => {
    const orderItem = createOrderItem({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(orderItem.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(orderItem.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should throw when created with empty id', () => {
    expect(() => createOrderItem({ id: '' })).toThrow();
  });

  it('should throw when created with negative gross price', () => {
    expect(() => createOrderItem({ grossPrice: -10 })).toThrow();
  });
});