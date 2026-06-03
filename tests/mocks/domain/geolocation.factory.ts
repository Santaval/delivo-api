import Location from '@/domain/geolocation/entities/Location';

export const createGeolocationLocation = (
  id: string = 'location-1',
  description: string = 'Test Location',
  latitude: number = 40.7128,
  longitude: number = -74.006,
  placeId: string = 'place-1'
): Location => {
  return new Location(id, description, latitude, longitude, placeId);
};