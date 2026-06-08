import { createRoutePoint } from '@/tests/mocks/domain';
import { createOrder } from '@/tests/mocks/domain';

describe('RoutePoint', () => {
  it('should create a route point with valid properties', () => {
    const routePoint = createRoutePoint();

    expect(routePoint.id).toBe('route-point-1');
    expect(routePoint.status).toBe('CREATED');
    expect(routePoint.index).toBe(0);
    expect(routePoint.polyline).toBeNull();
    expect(routePoint.routeId).toBe('route-1');
    expect(routePoint.createdAt).toBeInstanceOf(Date);
    expect(routePoint.updatedAt).toBeInstanceOf(Date);
  });

  it('should set index correctly', () => {
    const routePoint = createRoutePoint();
    routePoint.setIndex(5);

    expect(routePoint.index).toBe(5);
  });

  it('should set status correctly', () => {
    const routePoint = createRoutePoint();
    routePoint.setStatus('VISITED');

    expect(routePoint.status).toBe('VISITED');
  });

  it('should create route point with null index', () => {
    const routePoint = createRoutePoint({ index: null });

    expect(routePoint.index).toBeNull();
  });

  it('should create route point with null polyline', () => {
    const routePoint = createRoutePoint({ polyline: null });

    expect(routePoint.polyline).toBeNull();
  });

  it('should create route point with custom order', () => {
    const order = createOrder({ id: 'order-99', number: 9999 });
    const routePoint = createRoutePoint({ order });

    expect(routePoint.order.id).toBe('order-99');
    expect(routePoint.order.number).toBe(9999);
  });

  it('should use provided dates', () => {
    const routePoint = createRoutePoint({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(routePoint.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(routePoint.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should use default dates when not provided', () => {
    const routePoint = createRoutePoint({ createdAt: undefined, updatedAt: undefined });

    expect(routePoint.createdAt).toBeInstanceOf(Date);
    expect(routePoint.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw when created with empty id', () => {
    expect(() => createRoutePoint({ id: '' })).toThrow();
  });

  it('should throw when created with empty routeId', () => {
    expect(() => createRoutePoint({ routeId: '' })).toThrow();
  });

  it('should throw when created with invalid status', () => {
    expect(() => createRoutePoint({ status: 'invalid-status' })).toThrow();
  });
});