import RouteOptimizationService from '@/application/routes/services/implementations/RouteOptimizationService';
import IRouteRepository from '@/domain/routes/repositories/IRouteRepository';
import IRouteOptimizationProvider, { OptimizationResult } from '@/domain/routes/providers/IRouteOptimizationProvider';
import { createRoute, createRoutePoint, createOrder } from '@/tests/mocks/domain';
import { RouteId } from '@/domain/routes/valueObjects/routeId.valueObject';
import { Location } from '@/domain/clients/valueObjects/location.valouObject';

describe('RouteOptimizationService', () => {
  let service: RouteOptimizationService;
  let mockRouteRepository: jest.Mocked<IRouteRepository>;
  let mockOptimizationProvider: jest.Mocked<IRouteOptimizationProvider>;

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

    mockOptimizationProvider = {
      optimize: jest.fn(),
    } as jest.Mocked<IRouteOptimizationProvider>;

    service = new RouteOptimizationService(mockRouteRepository, mockOptimizationProvider);
  });

  describe('optimize', () => {
    it('throws ApplicationError when route not found', async () => {
      mockRouteRepository.findById.mockResolvedValue(null);
      const routeId = { value: 'non-existent' } as RouteId;
      const startLocation = { lat: 40.7128, lng: -74.006 } as Location;

      await expect(service.optimize(routeId, startLocation)).rejects.toThrow('Route not found');
    });
  });
});