import { RoutePoint as PrismaRoutePoint, RoutePointStatus } from '@/infrastructure/prisma/generated/prisma/client';
import { RoutePointCreateArgs, RoutePointUpdateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import PrismaRoutePointMapper from '@/infrastructure/routes/mappers/PrismaRoutePointMapper';
import { RoutePoint } from '@/domain/routes/entities/RoutePoint';
import { Order } from '@/domain/orders';
import { Company } from '@/domain/companies/entities/Company';
import { Client } from '@/domain/clients/entities/Client';

describe('PrismaRoutePointMapper', () => {
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

  const mockPrismaRoutePoint: PrismaRoutePoint = {
    id: 'point-uuid-1',
    status: 'CREATED',
    index: 0,
    polyline: 'test-polyline',
    routeId: 'route-uuid-1',
    billId: 'order-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  describe('toDomain', () => {
    it('maps all fields correctly from Prisma row to RoutePoint entity', () => {
      const dec = (n: number) => ({ toNumber: () => n });
      const mockRawPoint = {
        ...mockPrismaRoutePoint,
        bill: {
          id: 'bill-uuid-1',
          clientId: 'client-uuid-1',
          client: {
            id: 'client-uuid-1',
            name: 'Test Client',
            companyId: 'company-uuid-1',
            phoneNumber: null,
            email: null,
            lat: null,
            lng: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
          },
          items: [],
          payments: [],
          companyId: 'company-uuid-1',
          number: 1,
          status: 'PENDING',
          deliveryStatus: 'PENDING',
          issueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          subtotal: dec(100),
          ivaTotal: dec(13),
          total: dec(113),
          paid: dec(0),
        },
      };

      const point = PrismaRoutePointMapper.toDomain(mockRawPoint as unknown as Parameters<typeof PrismaRoutePointMapper.toDomain>[0]);

      expect(point).toBeInstanceOf(RoutePoint);
      expect(point.id).toBe(mockPrismaRoutePoint.id);
      expect(point.status).toBe(mockPrismaRoutePoint.status);
    });
  });

  describe('toPersistence', () => {
    it('returns correct RoutePointCreateArgs with data object', () => {
      const domainPoint = new RoutePoint({
        id: 'point-uuid-1',
        status: 'CREATED',
        index: 0,
        order: mockOrder,
        polyline: 'test-polyline',
        routeId: 'route-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: RoutePointCreateArgs = PrismaRoutePointMapper.toPersistence(domainPoint);

      expect(result.data).toMatchObject({
        billId: 'order-uuid-1',
        routeId: 'route-uuid-1',
        index: 0,
        polyline: 'test-polyline',
      });
      expect(result.include).toBeDefined();
    });
  });

  describe('toPersistenceUpdate', () => {
    it('returns correct RoutePointUpdateArgs with index, polyline, and status', () => {
      const domainPoint = new RoutePoint({
        id: 'point-uuid-1',
        status: 'VISITED',
        index: 1,
        order: mockOrder,
        polyline: 'updated-polyline',
        routeId: 'route-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      const result: RoutePointUpdateArgs = PrismaRoutePointMapper.toPersistenceUpdate(domainPoint);

      expect(result.where).toEqual({ id: 'point-uuid-1' });
      expect(result.data).toMatchObject({
        index: 1,
        polyline: 'updated-polyline',
        status: 'VISITED' as RoutePointStatus,
      });
    });
  });
});
