import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';
import GoogleRouteOptimizationProvider from '@/infrastructure/routes/providers/GoogleRouteOptimizationProvider';

const mockOptimizeTours = jest.fn();

jest.mock('@googlemaps/routeoptimization', () => ({
  RouteOptimizationClient: jest.fn().mockImplementation(() => ({
    optimizeTours: mockOptimizeTours,
  })),
}));

jest.mock('moment', () => {
  const mockMoment = jest.fn(() => ({
    startOf: jest.fn().mockReturnThis(),
    endOf: jest.fn().mockReturnThis(),
    unix: jest.fn().mockReturnValue(1705276800),
  }));
  (mockMoment as unknown as { unix: jest.Mock }).unix = jest.fn().mockReturnValue(1705276800);
  return mockMoment;
});

describe('GoogleRouteOptimizationProvider', () => {
  let provider: GoogleRouteOptimizationProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GOOGLE_SERVICE_ACCOUNT = JSON.stringify({ type: 'service_account' });
    process.env.GOOGLE_CLOUD_PROJECT = 'test-project';
    provider = new GoogleRouteOptimizationProvider();
  });

  afterEach(() => {
    delete process.env.GOOGLE_SERVICE_ACCOUNT;
    delete process.env.GOOGLE_CLOUD_PROJECT;
  });

  describe('constructor', () => {
    it('parses GOOGLE_SERVICE_ACCOUNT and sets parent correctly', () => {
      expect(provider).toBeDefined();
    });
  });

  describe('optimize', () => {
    const mockDeliveries = [
      { id: 'delivery-1', name: 'Delivery 1' },
    ] as unknown as Parameters<typeof provider.optimize>[0];

    const mockVehicles = [
      { id: 'vehicle-1', name: 'Vehicle 1' },
    ] as unknown as Parameters<typeof provider.optimize>[1];

    it('returns optimization result on success', async () => {
      const mockResponse = [
        {
          routes: [
            {
              visits: [{ visitLabel: 'delivery-1' }],
              routePolyline: { points: 'encoded-polyline' },
            },
          ],
        },
      ];

      mockOptimizeTours.mockResolvedValue(mockResponse);

      const result = await provider.optimize(mockDeliveries, mockVehicles);

      expect(result).toEqual({
        visits: [{ id: 'delivery-1' }],
        polyline: 'encoded-polyline',
      });
    });

    it('throws InfrastructureError when routes are missing', async () => {
      mockOptimizeTours.mockResolvedValue([{ routes: undefined }]);

      await expect(provider.optimize(mockDeliveries, mockVehicles)).rejects.toThrow(
        'No routes in response'
      );
    });

    it('throws InfrastructureError when route is missing', async () => {
      mockOptimizeTours.mockResolvedValue([{ routes: [null] }]);

      await expect(provider.optimize(mockDeliveries, mockVehicles)).rejects.toThrow(
        'No route found'
      );
    });

    it('throws InfrastructureError when visits are missing', async () => {
      mockOptimizeTours.mockResolvedValue([
        { routes: [{ visits: undefined, routePolyline: {} }] },
      ]);

      await expect(provider.optimize(mockDeliveries, mockVehicles)).rejects.toThrow(
        'No visits found'
      );
    });

    it('throws InfrastructureError on API failure', async () => {
      mockOptimizeTours.mockRejectedValue(new Error('API Error'));

      await expect(provider.optimize(mockDeliveries, mockVehicles)).rejects.toThrow(
        'Error optimizing tours'
      );
    });
  });
});
