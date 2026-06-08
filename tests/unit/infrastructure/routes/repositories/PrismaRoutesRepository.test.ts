import { CompanyId } from '@/domain/companies/valueObjects/companyId.valueObject';
import { RouteId } from '@/domain/routes/valueObjects/routeId.valueObject';
import { RoutePointId } from '@/domain/routes/valueObjects/routePointId.valueObject';
import DatabaseError from '@/infrastructure/core/errors/DatabaseError';
import DatabaseInsertError from '@/infrastructure/core/errors/DatabaseInsertError';
import PrismaRoutesRepository from '@/infrastructure/routes/repositories/PrismaRoutesRepository';
import PrismaRouteMapper from '@/infrastructure/routes/mappers/PrismaRouteMapper';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockFindMany = jest.fn();
  const mockFindUnique = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  return {
    prisma: {
      route: {
        findMany: mockFindMany,
        findUnique: mockFindUnique,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
      routePoint: {
        findUnique: mockFindUnique,
        create: mockCreate,
        update: mockUpdate,
        delete: mockDelete,
      },
    },
    __mockRouteFindMany: mockFindMany,
    __mockRouteFindUnique: mockFindUnique,
    __mockRouteCreate: mockCreate,
    __mockRouteUpdate: mockUpdate,
    __mockRouteDelete: mockDelete,
    __mockPointFindUnique: mockFindUnique,
    __mockPointCreate: mockCreate,
    __mockPointUpdate: mockUpdate,
    __mockPointDelete: mockDelete,
  };
});

const {
  __mockRouteFindMany: mockRouteFindMany,
  __mockRouteFindUnique: mockRouteFindUnique,
  __mockRouteCreate: mockRouteCreate,
  __mockRouteUpdate: mockRouteUpdate,
  __mockRouteDelete: mockRouteDelete,
  __mockPointFindUnique: mockPointFindUnique,
  __mockPointCreate: mockPointCreate,
  __mockPointUpdate: mockPointUpdate,
  __mockPointDelete: mockPointDelete,
} = jest.requireMock('@/infrastructure/prisma/client');

describe('PrismaRoutesRepository', () => {
  let repository: PrismaRoutesRepository;

  const mockRouteRow = {
    id: 'route-uuid-1',
    name: 'Test Route',
    status: 'CREATED',
    polyline: null,
    companyId: 'company-uuid-1',
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    points: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaRoutesRepository();
  });

  describe('findAllByCompany', () => {
    it('returns array of Route entities', async () => {
      mockRouteFindMany.mockResolvedValue([mockRouteRow]);

      const companyId = CompanyId.create('company-uuid-1');
      const result = await repository.findAllByCompany(companyId);

      expect(result).toHaveLength(1);
      expect(mockRouteFindMany).toHaveBeenCalledWith({
        where: { companyId: 'company-uuid-1' },
        orderBy: { createdAt: 'desc' },
        include: repository.getIncludeConditions(),
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockRouteFindMany.mockRejectedValue(new Error('DB Error'));

      const companyId = CompanyId.create('company-uuid-1');
      await expect(repository.findAllByCompany(companyId)).rejects.toThrow(DatabaseError);
    });
  });

  describe('create', () => {
    it('creates route and returns mapped entity', async () => {
      mockRouteCreate.mockResolvedValue(mockRouteRow);

      const { Route } = await import('@/domain/routes/entities/Route');
      const route = new Route({
        id: 'route-uuid-1',
        name: 'Test Route',
        status: 'CREATED',
        companyId: 'company-uuid-1',
        polyline: null,
      });

      const result = await repository.create(route);

      expect(mockRouteCreate).toHaveBeenCalled();
    });

    it('throws DatabaseInsertError on failure', async () => {
      mockRouteCreate.mockRejectedValue(new Error('DB Error'));

      const { Route } = await import('@/domain/routes/entities/Route');
      const route = new Route({
        id: 'route-uuid-1',
        name: 'Test Route',
        status: 'CREATED',
        companyId: 'company-uuid-1',
        polyline: null,
      });

      await expect(repository.create(route)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('findById', () => {
    it('returns Route when found', async () => {
      mockRouteFindUnique.mockResolvedValue(mockRouteRow);

      const routeId = RouteId.create('route-uuid-1');
      const result = await repository.findById(routeId);

      expect(result).not.toBeNull();
      expect(mockRouteFindUnique).toHaveBeenCalledWith({
        where: { id: 'route-uuid-1' },
        include: repository.getIncludeConditions(),
      });
    });

    it('returns null when not found', async () => {
      mockRouteFindUnique.mockResolvedValue(null);

      const routeId = RouteId.create('non-existent');
      const result = await repository.findById(routeId);

      expect(result).toBeNull();
    });

    it('returns null on error (silent failure)', async () => {
      mockRouteFindUnique.mockRejectedValue(new Error('DB Error'));

      const routeId = RouteId.create('route-uuid-1');
      const result = await repository.findById(routeId);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deletes route with correct id', async () => {
      mockRouteDelete.mockResolvedValue(mockRouteRow);

      const routeId = RouteId.create('route-uuid-1');
      await repository.delete(routeId);

      expect(mockRouteDelete).toHaveBeenCalledWith({
        where: { id: 'route-uuid-1' },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockRouteDelete.mockRejectedValue(new Error('DB Error'));

      const routeId = RouteId.create('route-uuid-1');
      await expect(repository.delete(routeId)).rejects.toThrow(DatabaseError);
    });
  });

  describe('update', () => {
    it('updates route and returns mapped entity', async () => {
      mockRouteUpdate.mockResolvedValue(mockRouteRow);

      const { Route } = await import('@/domain/routes/entities/Route');
      const route = new Route({
        id: 'route-uuid-1',
        name: 'Updated Route',
        status: 'STARTED',
        companyId: 'company-uuid-1',
        polyline: 'updated-polyline',
      });

      const result = await repository.update(route);

      expect(mockRouteUpdate).toHaveBeenCalled();
    });

    it('throws DatabaseError on failure', async () => {
      mockRouteUpdate.mockRejectedValue(new Error('DB Error'));

      const { Route } = await import('@/domain/routes/entities/Route');
      const route = new Route({
        id: 'route-uuid-1',
        name: 'Updated Route',
        status: 'STARTED',
        companyId: 'company-uuid-1',
        polyline: 'updated-polyline',
      });

      await expect(repository.update(route)).rejects.toThrow(DatabaseError);
    });
  });

  describe('addPoint', () => {
    it('creates route point', async () => {
      const dec = (n: number) => ({ toNumber: () => n });
      const mockPointRow = {
        id: 'point-uuid-1',
        status: 'CREATED',
        index: 0,
        polyline: null,
        routeId: 'route-uuid-1',
        billId: 'order-uuid-1',
        createdAt: new Date(),
        updatedAt: new Date(),
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
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
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
      mockPointCreate.mockResolvedValue(mockPointRow);

      const { RoutePoint } = await import('@/domain/routes/entities/RoutePoint');
      const { Order } = await import('@/domain/orders');
      const { Company } = await import('@/domain/companies/entities/Company');
      const { Client } = await import('@/domain/clients/entities/Client');

      const company = new Company({
        id: 'company-uuid-1',
        name: 'Test Company',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const client = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        companyId: 'company-uuid-1',
        lat: null,
        lng: null,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const order = new Order({
        id: 'order-uuid-1',
        client,
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
      });

      const point = new RoutePoint({
        id: 'point-uuid-1',
        status: 'CREATED',
        index: 0,
        order,
        polyline: null,
        routeId: 'route-uuid-1',
      });

      mockRouteFindUnique.mockResolvedValue(mockRouteRow);

      const result = await repository.addPoint(point);

      expect(mockPointCreate).toHaveBeenCalled();
    });

    it('throws DatabaseInsertError on failure', async () => {
      mockPointCreate.mockRejectedValue(new Error('DB Error'));

      const { RoutePoint } = await import('@/domain/routes/entities/RoutePoint');
      const { Order } = await import('@/domain/orders');
      const { Company } = await import('@/domain/companies/entities/Company');
      const { Client } = await import('@/domain/clients/entities/Client');

      const company = new Company({
        id: 'company-uuid-1',
        name: 'Test Company',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const client = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        companyId: 'company-uuid-1',
        lat: null,
        lng: null,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const order = new Order({
        id: 'order-uuid-1',
        client,
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
      });

      const point = new RoutePoint({
        id: 'point-uuid-1',
        status: 'CREATED',
        index: 0,
        order,
        polyline: null,
        routeId: 'route-uuid-1',
      });

      await expect(repository.addPoint(point)).rejects.toThrow(DatabaseInsertError);
    });
  });

  describe('removePoint', () => {
    it('deletes route point with correct id', async () => {
      mockPointDelete.mockResolvedValue({});

      const pointId =  RoutePointId.create('point-uuid-1');
      await repository.removePoint(pointId);

      expect(mockPointDelete).toHaveBeenCalledWith({
        where: { id: 'point-uuid-1' },
      });
    });

    it('throws DatabaseError on failure', async () => {
      mockPointDelete.mockRejectedValue(new Error('DB Error'));

      const pointId =  RoutePointId.create('point-uuid-1');
      await expect(repository.removePoint(pointId)).rejects.toThrow(DatabaseError);
    });
  });

  describe('findPointById', () => {
    it('returns RoutePoint when found', async () => {
      const dec = (n: number) => ({ toNumber: () => n });
      const mockPointRow = {
        id: 'point-uuid-1',
        status: 'CREATED',
        index: 0,
        polyline: null,
        routeId: 'route-uuid-1',
        billId: 'order-uuid-1',
        createdAt: new Date(),
        updatedAt: new Date(),
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
            deletedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
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

      mockPointFindUnique.mockResolvedValue(mockPointRow);

      const pointId =  RoutePointId.create('point-uuid-1');
      const result = await repository.findPointById(pointId);

      expect(result).not.toBeNull();
    });

    it('returns null when not found', async () => {
      mockPointFindUnique.mockResolvedValue(null);

      const pointId =  RoutePointId.create('non-existent');
      const result = await repository.findPointById(pointId);

      expect(result).toBeNull();
    });

    it('returns null on error (silent failure)', async () => {
      mockPointFindUnique.mockRejectedValue(new Error('DB Error'));

      const pointId = RoutePointId.create('point-uuid-1');
      const result = await repository.findPointById(pointId);

      expect(result).toBeNull();
    });
  });
});
