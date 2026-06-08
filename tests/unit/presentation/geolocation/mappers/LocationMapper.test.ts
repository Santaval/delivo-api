import { PlaceResult } from '@/application/geolocation/output/AutocompleteResult';
import { LocationMapper } from '@/presentation/geolocation/mappers/LocationMapper';

describe('LocationMapper', () => {
  describe('toLocationAutocompleteResponse', () => {
    it('should map PlaceResult array to LocationAutocompleteResponse', () => {
      const results: PlaceResult[] = [
        { description: 'Bogotá, Colombia', placeId: 'place-1' },
      ];
      const response = LocationMapper.toLocationAutocompleteResponse(results);
      expect(response.results).toHaveLength(1);
      expect(response.results[0].description).toBe('Bogotá, Colombia');
    });
  });

  describe('toLocationAutocompleteCommand', () => {
    it('should create LocationAutocompleteCommand', () => {
      const command = LocationMapper.toLocationAutocompleteCommand('Bogotá');
      expect(command.query).toBe('Bogotá');
    });
  });
});
