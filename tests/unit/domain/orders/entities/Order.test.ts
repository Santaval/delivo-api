import { createOrder } from '@/tests/mocks/domain';
import { createOrderItem } from '@/tests/mocks/domain';

describe('Order', () => {
  it('should create an order with valid properties', () => {
    const order = createOrder();

    expect(order.id).toBe('order-1');
    expect(order.number).toBe(1001);
    expect(order.subtotal).toBe(100);
    expect(order.ivaTotal).toBe(13);
    expect(order.total).toBe(113);
    expect(order.paid).toBe(0);
    expect(order.due).toBe(113);
    expect(order.companyId).toBe('company-1');
    expect(order.status).toBe('PENDING');
    expect(order.deliveryStatus).toBe('PENDING');
    expect(order.items).toHaveLength(1);
    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
  });

  it('should return items as a copy for immutability', () => {
    const order = createOrder();
    const itemsBefore = order.items;
    const itemsAfter = order.items;

    expect(itemsBefore).not.toBe(itemsAfter);
    expect(itemsBefore).toEqual(itemsAfter);
  });

  it('should set status correctly', () => {
    const order = createOrder();
    order.setStatus('PAID');

    expect(order.status).toBe('PAID');
  });

  it('should set delivery status correctly', () => {
    const order = createOrder();
    order.setDeliveryStatus('DELIVERED');

    expect(order.deliveryStatus).toBe('DELIVERED');
  });

  it('should set totals correctly', () => {
    const order = createOrder();
    order.setTotals(200, 26, 226);

    expect(order.subtotal).toBe(200);
    expect(order.ivaTotal).toBe(26);
    expect(order.total).toBe(226);
  });

  it('should set paid amount correctly', () => {
    const order = createOrder();
    order.setPaid(50);

    expect(order.paid).toBe(50);
    expect(order.due).toBe(63);
  });

  it('should create order with custom items', () => {
    const order = createOrder({
      items: [createOrderItem({ id: 'item-1', quantity: 3 }), createOrderItem({ id: 'item-2', quantity: 1 })],
    });

    expect(order.items).toHaveLength(2);
    expect(order.items[0].quantity).toBe(3);
    expect(order.items[1].quantity).toBe(1);
  });

  it('should create order with empty items', () => {
    const order = createOrder({ items: [] });

    expect(order.items).toHaveLength(0);
  });

  it('should use provided dates', () => {
    const order = createOrder({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(order.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(order.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should use default dates when not provided', () => {
    const order = createOrder({ createdAt: undefined, updatedAt: undefined });

    expect(order.createdAt).toBeInstanceOf(Date);
    expect(order.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw when created with empty id', () => {
    expect(() => createOrder({ id: '' })).toThrow();
  });

  it('should throw when created with empty companyId', () => {
    expect(() => createOrder({ companyId: '' })).toThrow();
  });
});