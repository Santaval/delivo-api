import LocationService from '@/application/geolocation/services/implementations/LocationService';
import { ILocationService } from '@/application/geolocation/services/interfaces/ILocationService';
import { IPlacesService } from '@/application/geolocation/services/interfaces/IPlacesService';
import { LocationAutocompleteCommand } from '@/application/geolocation/input/LocationAutocompleteCommand';
import { PlaceSuggestion } from '@/domain/geolocation/valueObjects/PlaceSuggestion';
import { PlaceDetailsResult } from '@/application/geolocation/output/PlaceDetailsResult';
import { createGeolocationLocation } from '@/tests/mocks/domain';

describe('LocationService', () => {
  let service: ILocationService;
  let mockPlacesService: jest.Mocked<IPlacesService>;

  beforeEach(() => {
    mockPlacesService = {
      autocomplete: jest.fn(),
      details: jest.fn(),
    } as jest.Mocked<IPlacesService>;

    service = new LocationService(mockPlacesService);
  });

  describe('autocomplete', () => {
    it('returns place results from places service', async () => {
      const command: LocationAutocompleteCommand = { query: 'New York' };
      const suggestions: PlaceSuggestion[] = [
        {
          placeId: 'place-1',
          description: 'New York, NY, USA',
        },
        {
          placeId: 'place-2',
          description: 'New York Mills, MN, USA',
        },
      ];

      mockPlacesService.autocomplete.mockResolvedValue(suggestions);

      const result = await service.autocomplete(command);

      expect(mockPlacesService.autocomplete).toHaveBeenCalledWith('New York');
      expect(result).toHaveLength(2);
      expect(result[0].placeId).toBe('place-1');
      expect(result[0].description).toBe('New York, NY, USA');
      expect(result[1].placeId).toBe('place-2');
      expect(result[1].description).toBe('New York Mills, MN, USA');
    });

    it('returns empty array when no suggestions', async () => {
      const command: LocationAutocompleteCommand = { query: '' };

      mockPlacesService.autocomplete.mockResolvedValue([]);

      const result = await service.autocomplete(command);

      expect(result).toHaveLength(0);
    });
  });

  describe('placeDetails', () => {
    it('returns place details from places service', async () => {
      const details: PlaceDetailsResult = {
        placeId: 'place-1',
        name: 'Times Square',
        address: 'Manhattan, NY 10036, USA',
        latitude: 40.758,
        longitude: -73.9855,
      };

      mockPlacesService.details.mockResolvedValue(details);

      const result = await service.placeDetails('place-1');

      expect(mockPlacesService.details).toHaveBeenCalledWith('place-1');
      expect(result).toEqual(details);
    });

    it('returns undefined when place details not found', async () => {
      mockPlacesService.details.mockResolvedValue(undefined as any);

      const result = await service.placeDetails('non-existent');

      expect(result).toBeUndefined();
    });
  });
});