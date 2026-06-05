import { Route } from '@/domain/routes';
import { RoutePoint } from '@/domain/routes';
import { Order } from '@/domain/orders';
import { Client } from '@/domain/clients/entities/Client';
import RouteDtoMapper from './RouteDtoMapper';
import CreateRouteRequest from '../requests/CreateRouteRequest';

describe('RouteDtoMapper', () => {
  const createRoute = (): Route => {
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
    const point = new RoutePoint({
      id: 'point-1',
      status: 'CREATED',
      index: 0,
      order,
      polyline: null,
      routeId: 'route-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return new Route({
      id: 'route-1',
      name: 'Ruta Norte',
      status: 'CREATED',
      companyId: 'comp-1',
      polyline: null,
      points: [point],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  describe('toResponse', () => {
    it('should map Route to RouteResponse', () => {
      const route = createRoute();
      const response = RouteDtoMapper.toResponse(route);
      expect(response.id).toBe('route-1');
      expect(response.name).toBe('Ruta Norte');
      expect(response.status).toBe('CREATED');
      expect(response.companyId).toBe('comp-1');
      expect(response.points).toHaveLength(1);
    });
  });

  describe('fromCreateToDomain', () => {
    it('should map CreateRouteRequest to Route', () => {
      const request: CreateRouteRequest = { name: 'Ruta Sur' };
      const route = RouteDtoMapper.fromCreateToDomain(request, 'comp-1');
      expect(route).toBeInstanceOf(Route);
      expect(route.name).toBe('Ruta Sur');
      expect(route.status).toBe('CREATED');
      expect(route.companyId).toBe('comp-1');
    });
  });
});
