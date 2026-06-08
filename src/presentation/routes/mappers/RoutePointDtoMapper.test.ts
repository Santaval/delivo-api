import { RoutePoint } from '@/domain/routes';
import { Order } from '@/domain/orders';
import { Client } from '@/domain/clients/entities/Client';
import RoutePointDtoMapper from './RoutePointDtoMapper';
import AddRouteItemRequest from '../requests/AddRouteItemRequest';

describe('RoutePointDtoMapper', () => {
  const createRoutePoint = (): RoutePoint => {
    const client = new Client({
      id: 'client-1',
      name: 'Juan',
      companyId: 'comp-1',
      lat: 10,
      lng: -66,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const order = new Order({
      id: 'order-1',
      client,
      number: 1,
      subtotal: 100,
      ivaTotal: 13,
      total: 113,
      paid: 0,
      companyId: 'comp-1',
      items: [],
      status: 'PENDING',
      deliveryStatus: 'PENDING',
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return new RoutePoint({
      id: 'point-1',
      status: 'CREATED',
      index: 0,
      order,
      polyline: null,
      routeId: 'route-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  describe('toResponse', () => {
    it('should map RoutePoint to RoutePointResponse', () => {
      const point = createRoutePoint();
      const response = RoutePointDtoMapper.toResponse(point);
      expect(response.id).toBe('point-1');
      expect(response.status).toBe('CREATED');
      expect(response.index).toBe(0);
      expect(response.routeId).toBe('route-1');
      expect(response.order.id).toBe('order-1');
    });
  });

  describe('fromAddRequest', () => {
    it('should map AddRouteItemRequest to RoutePoint', () => {
      const request: AddRouteItemRequest = { orderId: 'order-1' };
      const point = RoutePointDtoMapper.fromAddRequest(request, 'route-1');
      expect(point).toBeInstanceOf(RoutePoint);
      expect(point.routeId).toBe('route-1');
      expect(point.order.id).toBe('order-1');
    });
  });
});
