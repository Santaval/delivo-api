import { PlaceSuggestion } from '@/domain/geolocation/valueObjects/PlaceSuggestion';

describe('PlaceSuggestion', () => {
  it('should create a PlaceSuggestion with valid values', () => {
    const suggestion = new PlaceSuggestion('place-123', '123 Main Street');

    expect(suggestion.placeId).toBe('place-123');
    expect(suggestion.description).toBe('123 Main Street');
  });

  it('should create PlaceSuggestion with empty strings', () => {
    const suggestion = new PlaceSuggestion('', '');

    expect(suggestion.placeId).toBe('');
    expect(suggestion.description).toBe('');
  });

  it('should create PlaceSuggestion with special characters', () => {
    const suggestion = new PlaceSuggestion('place-abc-123', 'Street #5, Near "Central Park"');

    expect(suggestion.placeId).toBe('place-abc-123');
    expect(suggestion.description).toBe('Street #5, Near "Central Park"');
  });
});