import { createGeolocationLocation } from '@/tests/mocks/domain';

describe('Location (geolocation)', () => {
  it('should create a location with valid properties', () => {
    const location = createGeolocationLocation();

    expect(location.id).toBe('location-1');
    expect(location.description.value).toBe('Test Location');
    expect(location.coordinate.latitude).toBe(40.7128);
    expect(location.coordinate.longitude).toBe(-74.006);
    expect(location.placeId).toBe('place-1');
  });

  it('should create a location with custom parameters', () => {
    const location = createGeolocationLocation(
      'loc-99',
      'Custom Place',
      51.5074,
      -0.1278,
      'place-99'
    );

    expect(location.id).toBe('loc-99');
    expect(location.description.value).toBe('Custom Place');
    expect(location.coordinate.latitude).toBe(51.5074);
    expect(location.coordinate.longitude).toBe(-0.1278);
    expect(location.placeId).toBe('place-99');
  });

  it('should create location with negative coordinates', () => {
    const location = createGeolocationLocation(
      'loc-negative',
      'Negative Coords',
      -33.8688,
      151.2093,
      'place-sydney'
    );

    expect(location.coordinate.latitude).toBe(-33.8688);
    expect(location.coordinate.longitude).toBe(151.2093);
  });

  it('should throw when created with invalid latitude', () => {
    expect(() => new (require('@/domain/geolocation/entities/Location').default)('id', 'desc', 100, 0, 'place')).toThrow();
  });

  it('should throw when created with invalid longitude', () => {
    expect(() => new (require('@/domain/geolocation/entities/Location').default)('id', 'desc', 0, 200, 'place')).toThrow();
  });
});