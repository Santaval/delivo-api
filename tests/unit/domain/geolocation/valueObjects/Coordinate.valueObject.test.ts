import { Coordinate } from '@/domain/geolocation/valueObjects/Coordinate.valueObject';
import DataError from '@/domain/core/errors/DataError';

describe('Coordinate', () => {
  it('should create a Coordinate with valid latitude and longitude', () => {
    const coordinate = Coordinate.create(40.7128, -74.006);

    expect(coordinate.latitude).toBe(40.7128);
    expect(coordinate.longitude).toBe(-74.006);
  });

  it('should return value object with latitude and longitude', () => {
    const coordinate = Coordinate.create(40.7128, -74.006);

    expect(coordinate.value).toEqual({
      latitude: 40.7128,
      longitude: -74.006,
    });
  });

  it('should create Coordinate with boundary latitude values', () => {
    const coordinateMin = Coordinate.create(-90, 0);
    const coordinateMax = Coordinate.create(90, 0);

    expect(coordinateMin.latitude).toBe(-90);
    expect(coordinateMax.latitude).toBe(90);
  });

  it('should create Coordinate with boundary longitude values', () => {
    const coordinateMin = Coordinate.create(0, -180);
    const coordinateMax = Coordinate.create(0, 180);

    expect(coordinateMin.longitude).toBe(-180);
    expect(coordinateMax.longitude).toBe(180);
  });

  it('should create Coordinate with zero values', () => {
    const coordinate = Coordinate.create(0, 0);

    expect(coordinate.latitude).toBe(0);
    expect(coordinate.longitude).toBe(0);
  });

  it('should throw DataError when latitude is less than -90', () => {
    expect(() => Coordinate.create(-91, 0)).toThrow(DataError);
    expect(() => Coordinate.create(-91, 0)).toThrow('Latitude must be between -90 and 90 degrees');
  });

  it('should throw DataError when latitude is greater than 90', () => {
    expect(() => Coordinate.create(91, 0)).toThrow(DataError);
    expect(() => Coordinate.create(91, 0)).toThrow('Latitude must be between -90 and 90 degrees');
  });

  it('should throw DataError when longitude is less than -180', () => {
    expect(() => Coordinate.create(0, -181)).toThrow(DataError);
    expect(() => Coordinate.create(0, -181)).toThrow('Longitude must be between -180 and 180 degrees');
  });

  it('should throw DataError when longitude is greater than 180', () => {
    expect(() => Coordinate.create(0, 181)).toThrow(DataError);
    expect(() => Coordinate.create(0, 181)).toThrow('Longitude must be between -180 and 180 degrees');
  });
});