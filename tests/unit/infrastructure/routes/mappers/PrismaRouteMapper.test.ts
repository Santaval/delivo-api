import { Route as PrismaRoute, RouteStatus } from '@/infrastructure/prisma/generated/prisma/client';
import { RouteCreateArgs, RouteUpdateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import PrismaRouteMapper from '@/infrastructure/routes/mappers/PrismaRouteMapper';
import { Route } from '@/domain/routes/entities/Route';
import { RoutePoint } from '@/domain/routes/entities/RoutePoint';
import { Order } from '@/domain/orders';
import { Company } from '@/domain/companies/entities/Company';
import { Client } from '@/domain/clients/entities/Client';

describe('PrismaRouteMapper', () => {
  const mockCompany = new Company({
    id: 'company-uuid-1',
    name: 'Test Company',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockClient = new Client({
    id: 'client-uuid-1',
    name: 'Test Client',
    companyId: 'company-uuid-1',
    lat: null,
    lng: null,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockOrder = new Order({
    id: 'order-uuid-1',
    client: mockClient,
    number: 1,
    subtotal: 100,
    ivaTotal: 13,
    total: 113,
    paid: 0,
    companyId: 'company-uuid-1',
    items: [],
    status: 'PENDING',
    deliveryStatus: 'PENDING',
    payments: [],
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockRoutePoint = new RoutePoint({
    id: 'point-uuid-1',
    status: 'CREATED',
    index: 0,
    order: mockOrder,
    polyline: 'test-polyline',
    routeId: 'route-uuid-1',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockPrismaRoute: PrismaRoute & { points: unknown[] } = {
    id: 'route-uuid-1',
    name: 'Test Route',
    status: 'CREATED',
    polyline: null,
    points: [],
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  describe('toDomain', () => {
    it('maps all fields correctly from Prisma row to Route entity', () => {
      const route = PrismaRouteMapper.toDomain(mockPrismaRoute as unknown as Parameters<typeof PrismaRouteMapper.toDomain>[0]);

      expect(route).toBeInstanceOf(Route);
      expect(route.id).toBe(mockPrismaRoute.id);
      expect(route.name).toBe(mockPrismaRoute.name);
      expect(route.status).toBe(mockPrismaRoute.status);
      expect(route.companyId).toBe(mockPrismaRoute.companyId);
    });

    it('handles null polyline', () => {
      const route = PrismaRouteMapper.toDomain(mockPrismaRoute as unknown as Parameters<typeof PrismaRouteMapper.toDomain>[0]);

      expect(route.polyline).toBeNull();
    });
  });

  describe('toPersistence', () => {
    it('returns correct RouteCreateArgs with data object', () => {
      const domainRoute = new Route({
        id: 'route-uuid-1',
        name: 'Test Route',
        status: 'CREATED',
        companyId: 'company-uuid-1',
        polyline: null,
        points: [],
      });

      const result: RouteCreateArgs = PrismaRouteMapper.toPersistence(domainRoute);

      expect(result.data).toEqual({
        name: 'Test Route',
        companyId: 'company-uuid-1',
      });
      expect(result.include).toBeDefined();
    });
  });

  describe('toPersistenceUpdate', () => {
    it('returns correct RouteUpdateArgs with name, polyline, and status', () => {
      const domainRoute = new Route({
        id: 'route-uuid-1',
        name: 'Updated Route',
        status: 'STARTED',
        companyId: 'company-uuid-1',
        polyline: 'updated-polyline',
        points: [],
      });

      const result: RouteUpdateArgs = PrismaRouteMapper.toPersistenceUpdate(domainRoute);

      expect(result.where).toEqual({ id: 'route-uuid-1' });
      expect(result.data).toEqual({
        name: 'Updated Route',
        polyline: 'updated-polyline',
        status: 'STARTED' as RouteStatus,
      });
    });
  });

  describe('getIncludeConditions', () => {
    it('returns expected nested include structure', () => {
      const include = PrismaRouteMapper.getIncludeConditions();

      expect(include).toHaveProperty('points');
      expect((include as { points: { include: { bill: { include: object } } } }).points.include).toHaveProperty('bill');
    });
  });
});
