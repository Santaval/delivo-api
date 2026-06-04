import { PlacesDtoMapper } from '@/application/geolocation/services/mappers/PlacesDtoMapper';
import { PlaceSuggestion } from '@/domain/geolocation/valueObjects/PlaceSuggestion';
import { createGeolocationLocation } from '@/tests/mocks/domain';

describe('PlacesDtoMapper', () => {
  describe('toPlaceResult', () => {
    it('maps PlaceSuggestion to PlaceResult correctly', () => {
      const suggestion: PlaceSuggestion = {
        placeId: 'ChIJOwg_06VPwokRYv534QaPC8g',
        description: '1600 Amphitheatre Parkway, Mountain View, CA 94043, USA',
      };

      const result = PlacesDtoMapper.toPlaceResult(suggestion);

      expect(result.placeId).toBe('ChIJOwg_06VPwokRYv534QaPC8g');
      expect(result.description).toBe('1600 Amphitheatre Parkway, Mountain View, CA 94043, USA');
    });

    it('handles different place id formats', () => {
      const suggestion: PlaceSuggestion = {
        placeId: 'abc123',
        description: 'Simple Address',
      };

      const result = PlacesDtoMapper.toPlaceResult(suggestion);

      expect(result.placeId).toBe('abc123');
      expect(result.description).toBe('Simple Address');
    });
  });
});