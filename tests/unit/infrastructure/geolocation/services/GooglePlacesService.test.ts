import { Client } from '@googlemaps/google-maps-services-js';
import GooglePlacesService from '@/infrastructure/geolocation/services/GooglePlacesService';

jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    placeAutocomplete: jest.fn(),
    placeDetails: jest.fn(),
  })),
}));

describe('GooglePlacesService', () => {
  let service: GooglePlacesService;
  let mockClient: jest.Mocked<Client>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = new Client() as jest.Mocked<Client>;
    service = new GooglePlacesService();
  });

  describe('autocomplete', () => {
    it('returns place suggestions for valid query', async () => {
      const mockPredictions = [
        { description: 'San José, Costa Rica', place_id: 'place1' },
        { description: 'San Pedro, Costa Rica', place_id: 'place2' },
      ];

      (mockClient.placeAutocomplete as jest.Mock).mockResolvedValue({
        data: { predictions: mockPredictions },
      });

      const result = await service.autocomplete('San Jose');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ description: 'San José, Costa Rica', placeId: 'place1' });
      expect(result[1]).toEqual({ description: 'San Pedro, Costa Rica', placeId: 'place2' });
    });

    it('passes country restriction to API', async () => {
      (mockClient.placeAutocomplete as jest.Mock).mockResolvedValue({
        data: { predictions: [] },
      });

      await service.autocomplete('test');

      expect(mockClient.placeAutocomplete).toHaveBeenCalledWith({
        params: expect.objectContaining({
          components: ['country:cr'],
        }),
      });
    });

    it('uses GOOGLE_MAPS_API_KEY from environment', async () => {
      process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';

      (mockClient.placeAutocomplete as jest.Mock).mockResolvedValue({
        data: { predictions: [] },
      });

      await service.autocomplete('test');

      expect(mockClient.placeAutocomplete).toHaveBeenCalledWith({
        params: expect.objectContaining({
          key: 'test-api-key',
        }),
      });

      delete process.env.GOOGLE_MAPS_API_KEY;
    });

    it('throws InfrastructureError on API failure', async () => {
      (mockClient.placeAutocomplete as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(service.autocomplete('test')).rejects.toThrow(
        'Failed to fetch place autocomplete'
      );
    });
  });

  describe('details', () => {
    const mockDetailsResponse = {
      data: {
        result: {
          name: 'Test Place',
          formatted_address: '123 Test St',
          geometry: {
            location: {
              lat: 9.9281,
              lng: -84.0907,
            },
          },
        },
      },
    };

    it('returns place details for valid placeId', async () => {
      (mockClient.placeDetails as jest.Mock).mockResolvedValue(mockDetailsResponse);

      const result = await service.details('place123');

      expect(result).toEqual({
        placeId: 'place123',
        name: 'Test Place',
        address: '123 Test St',
        latitude: 9.9281,
        longitude: -84.0907,
      });
    });

    it('passes correct fields to API', async () => {
      (mockClient.placeDetails as jest.Mock).mockResolvedValue(mockDetailsResponse);

      await service.details('place123');

      expect(mockClient.placeDetails).toHaveBeenCalledWith({
        params: expect.objectContaining({
          place_id: 'place123',
          fields: ['geometry', 'name', 'place_id'],
        }),
      });
    });

    it('throws InfrastructureError when geometry is missing', async () => {
      (mockClient.placeDetails as jest.Mock).mockResolvedValue({
        data: {
          result: {
            name: 'Test Place',
            geometry: undefined,
          },
        },
      });

      await expect(service.details('place123')).rejects.toThrow(
        'Location data not found in place details'
      );
    });

    it('throws InfrastructureError when location is missing in geometry', async () => {
      (mockClient.placeDetails as jest.Mock).mockResolvedValue({
        data: {
          result: {
            name: 'Test Place',
            geometry: {},
          },
        },
      });

      await expect(service.details('place123')).rejects.toThrow(
        'Location data not found in place details'
      );
    });

    it('throws InfrastructureError on API failure', async () => {
      (mockClient.placeDetails as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(service.details('place123')).rejects.toThrow(
        'Failed to fetch place details'
      );
    });
  });
});
