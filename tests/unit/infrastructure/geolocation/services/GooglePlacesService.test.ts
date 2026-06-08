import { GooglePlacesService } from '@/infrastructure/geolocation/services/GooglePlacesService';

const mockPlaceAutocomplete = jest.fn();
const mockPlaceDetails = jest.fn();

jest.mock('@googlemaps/google-maps-services-js', () => ({
  Client: jest.fn().mockImplementation(() => ({
    placeAutocomplete: mockPlaceAutocomplete,
    placeDetails: mockPlaceDetails,
  })),
}));

describe('GooglePlacesService', () => {
  let service: GooglePlacesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GooglePlacesService();
  });

  describe('autocomplete', () => {
    it('returns place suggestions for valid query', async () => {
      const mockPredictions = [
        { description: 'San José, Costa Rica', place_id: 'place1' },
        { description: 'San Pedro, Costa Rica', place_id: 'place2' },
      ];

      (mockPlaceAutocomplete as jest.Mock).mockResolvedValue({
        data: { predictions: mockPredictions },
      });

      const result = await service.autocomplete('San Jose');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ description: 'San José, Costa Rica', placeId: 'place1' });
      expect(result[1]).toEqual({ description: 'San Pedro, Costa Rica', placeId: 'place2' });
    });

    it('passes country restriction to API', async () => {
      (mockPlaceAutocomplete as jest.Mock).mockResolvedValue({
        data: { predictions: [] },
      });

      await service.autocomplete('test');

      expect(mockPlaceAutocomplete).toHaveBeenCalledWith({
        params: expect.objectContaining({
          components: ['country:cr'],
        }),
      });
    });

    it('uses GOOGLE_MAPS_API_KEY from environment', async () => {
      process.env.GOOGLE_MAPS_API_KEY = 'test-api-key';

      (mockPlaceAutocomplete as jest.Mock).mockResolvedValue({
        data: { predictions: [] },
      });

      await service.autocomplete('test');

      expect(mockPlaceAutocomplete).toHaveBeenCalledWith({
        params: expect.objectContaining({
          key: 'test-api-key',
        }),
      });

      delete process.env.GOOGLE_MAPS_API_KEY;
    });

    it('throws InfrastructureError on API failure', async () => {
      (mockPlaceAutocomplete as jest.Mock).mockRejectedValue(new Error('API Error'));

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
      (mockPlaceDetails as jest.Mock).mockResolvedValue(mockDetailsResponse);

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
      (mockPlaceDetails as jest.Mock).mockResolvedValue(mockDetailsResponse);

      await service.details('place123');

      expect(mockPlaceDetails).toHaveBeenCalledWith({
        params: expect.objectContaining({
          place_id: 'place123',
          fields: ['geometry', 'name', 'place_id'],
        }),
      });
    });

    it('throws InfrastructureError when geometry is missing', async () => {
      (mockPlaceDetails as jest.Mock).mockResolvedValue({
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
      (mockPlaceDetails as jest.Mock).mockResolvedValue({
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
      (mockPlaceDetails as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(service.details('place123')).rejects.toThrow(
        'Failed to fetch place details'
      );
    });
  });
});
