import RouteService from '@/application/routes/services/implementations/RouteService';
import IRouteRepository from '@/domain/routes/repositories/IRouteRepository';
import IRouteOptimizationService from '@/domain/routes/service/IRouteOptimizationService';
import IOrderDeliveryStatusManager from '@/domain/orders/services/IOrderDeliveryStatusManager';
import { createRoute, createRoutePoint, createOrder } from '@/tests/mocks/domain';
import { RouteId } from '@/domain/routes/valueObjects/routeId.valueObject';
import { RoutePointId } from '@/domain/routes/valueObjects/routePointId.valueObject';
import { Location } from '@/domain/clients/valueObjects/location.valouObject';
import ApplicationError from '@/application/core/errors/ApplicationError';

describe('RouteService', () => {
  let service: RouteService;
  let mockRouteRepository: jest.Mocked<IRouteRepository>;
  let mockOptimizationService: jest.Mocked<IRouteOptimizationService>;
  let mockDeliveryStatusManager: jest.Mocked<IOrderDeliveryStatusManager>;

  beforeEach(() => {
    mockRouteRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAllByCompany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addPoint: jest.fn(),
      removePoint: jest.fn(),
      updatePoint: jest.fn(),
      findPointById: jest.fn(),
    } as jest.Mocked<IRouteRepository>;

    mockOptimizationService = {
      optimize: jest.fn(),
    } as jest.Mocked<IRouteOptimizationService>;

    mockDeliveryStatusManager = {
      change: jest.fn(),
    } as jest.Mocked<IOrderDeliveryStatusManager>;

    service = new RouteService(mockRouteRepository, mockOptimizationService, mockDeliveryStatusManager);
  });

  describe('findAllByCompany', () => {
    it('returns all routes for company', async () => {
      const routes = [createRoute(), createRoute({ id: 'route-2' })];
      mockRouteRepository.findAllByCompany.mockResolvedValue(routes);

      const result = await service.findAllByCompany({ value: 'company-1' } as any);

      expect(mockRouteRepository.findAllByCompany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('create', () => {
    it('creates and returns route', async () => {
      const route = createRoute();
      mockRouteRepository.create.mockResolvedValue(route);

      const result = await service.create(route);

      expect(mockRouteRepository.create).toHaveBeenCalledWith(route);
      expect(result).toBe(route);
    });
  });

  describe('update', () => {
    it('updates and returns route', async () => {
      const route = createRoute({ name: 'Updated Route' });
      mockRouteRepository.update.mockResolvedValue(route);

      const result = await service.update(route);

      expect(mockRouteRepository.update).toHaveBeenCalledWith(route);
      expect(result).toBe(route);
    });
  });

  describe('delete', () => {
    it('deletes route', async () => {
      mockRouteRepository.delete.mockResolvedValue();
      const routeId = { value: 'route-1' } as RouteId;

      await service.delete(routeId);

      expect(mockRouteRepository.delete).toHaveBeenCalledWith(routeId);
    });
  });

  describe('addPoint', () => {
    it('adds point and changes order status to ON_ROUTE', async () => {
      const point = createRoutePoint();
      mockRouteRepository.addPoint.mockResolvedValue(point);
      mockDeliveryStatusManager.change.mockResolvedValue(createOrder() as any);

      const result = await service.addPoint(point);

      expect(mockRouteRepository.addPoint).toHaveBeenCalledWith(point);
      expect(mockDeliveryStatusManager.change).toHaveBeenCalledWith(point.order.id, 'ON_ROUTE');
      expect(result).toBe(point);
    });
  });

  describe('removePoint', () => {
    it('removes point and changes order status to PENDING', async () => {
      const pointId = { value: 'route-point-1' } as RoutePointId;

      mockRouteRepository.removePoint.mockResolvedValue();
      mockDeliveryStatusManager.change.mockResolvedValue(createOrder() as any);

      await service.removePoint(pointId);

      expect(mockRouteRepository.removePoint).toHaveBeenCalledWith(pointId);
      expect(mockDeliveryStatusManager.change).toHaveBeenCalledWith(pointId.value, 'PENDING');
    });
  });

  describe('findById', () => {
    it('returns route by id', async () => {
      const route = createRoute();
      const routeId = { value: 'route-1' } as RouteId;
      mockRouteRepository.findById.mockResolvedValue(route);

      const result = await service.findById(routeId);

      expect(mockRouteRepository.findById).toHaveBeenCalledWith(routeId);
      expect(result).toBe(route);
    });

    it('returns null when route not found', async () => {
      const routeId = { value: 'non-existent' } as RouteId;
      mockRouteRepository.findById.mockResolvedValue(null);

      const result = await service.findById(routeId);

      expect(result).toBeNull();
    });
  });

  describe('start', () => {
    it('optimizes route, sets status to STARTED, changes orders to IN_TRANSIT', async () => {
      const order = createOrder();
      const point = createRoutePoint({ order });
      const route = createRoute({ points: [point] });

      const optimizedRoute = {
        ...route,
        points: [point],
        setStatus: jest.fn(),
        setPolyline: jest.fn(),
      };

      mockOptimizationService.optimize.mockResolvedValue(optimizedRoute as any);
      mockRouteRepository.update.mockResolvedValue(optimizedRoute as any);
      mockDeliveryStatusManager.change.mockResolvedValue(order as any);

      const result = await service.start({ value: 'route-1' } as RouteId, { lat: 40.7128, lng: -74.006 } as Location);

      expect(mockOptimizationService.optimize).toHaveBeenCalled();
      expect(optimizedRoute.setStatus).toHaveBeenCalledWith('STARTED');
    });
  });

  describe('finish', () => {
    it('throws error when route not found', async () => {
      mockRouteRepository.findById.mockResolvedValue(null);
      const routeId = { value: 'non-existent' } as RouteId;

      await expect(service.finish(routeId)).rejects.toThrow('Route not found');
    });
  });

  describe('completeDelivery', () => {
    it('throws error when route point not found', async () => {
      mockRouteRepository.findPointById.mockResolvedValue(null);
      const pointId = { value: 'non-existent' } as RoutePointId;

      await expect(service.completeDelivery(pointId)).rejects.toThrow('Route point not found');
    });
  });

  describe('skipDelivery', () => {
    it('throws error when route point not found', async () => {
      mockRouteRepository.findPointById.mockResolvedValue(null);
      const pointId = { value: 'non-existent' } as RoutePointId;

      await expect(service.skipDelivery(pointId)).rejects.toThrow('Route point not found');
    });
  });

  describe('markAsFinished', () => {
    it('throws ApplicationError when not all points are finished', async () => {
      const point = createRoutePoint({ status: 'CREATED' });
      const route = createRoute({ points: [point] });
      const routeId = { value: 'route-1' } as RouteId;

      mockRouteRepository.findById.mockResolvedValue(route);

      await expect(service.markAsFinished(routeId)).rejects.toThrow(ApplicationError);
    });
  });

  describe('tryMarkAsFinished', () => {
    it('returns null when markAsFinished throws ApplicationError', async () => {
      const point = createRoutePoint({ status: 'CREATED' });
      const route = createRoute({ points: [point] });
      const routeId = { value: 'route-1' } as RouteId;

      mockRouteRepository.findById.mockResolvedValue(route);

      const result = await service.tryMarkAsFinished(routeId);

      expect(result).toBeNull();
    });
  });
});