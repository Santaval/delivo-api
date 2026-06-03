import { Location } from '@/domain/clients/valueObjects/location.valouObject';
import DataException from '@/domain/core/errors/DataError';

describe('Location', () => {
  it('should create a Location with valid coordinates', () => {
    const location = Location.create(40.7128, -74.006);

    expect(location.lat).toBe(40.7128);
    expect(location.lng).toBe(-74.006);
  });

  it('should create a Location with null coordinates', () => {
    const location = Location.create(null, null);

    expect(location.lat).toBeNull();
    expect(location.lng).toBeNull();
  });

  it('should create a Location with partial null coordinates', () => {
    const location = Location.create(40.7128, null);

    expect(location.lat).toBe(40.7128);
    expect(location.lng).toBeNull();
  });

  it('should create a Location with boundary latitude values', () => {
    const locationMin = Location.create(-90, 0);
    const locationMax = Location.create(90, 0);

    expect(locationMin.lat).toBe(-90);
    expect(locationMax.lat).toBe(90);
  });

  it('should create a Location with boundary longitude values', () => {
    const locationMin = Location.create(0, -180);
    const locationMax = Location.create(0, 180);

    expect(locationMin.lng).toBe(-180);
    expect(locationMax.lng).toBe(180);
  });

  it('should throw DataException when latitude is less than -90', () => {
    expect(() => Location.create(-91, 0)).toThrow(DataException);
    expect(() => Location.create(-91, 0)).toThrow('Invalid latitude');
  });

  it('should throw DataException when latitude is greater than 90', () => {
    expect(() => Location.create(91, 0)).toThrow(DataException);
    expect(() => Location.create(91, 0)).toThrow('Invalid latitude');
  });

  it('should throw DataException when longitude is less than -180', () => {
    expect(() => Location.create(0, -181)).toThrow(DataException);
    expect(() => Location.create(0, -181)).toThrow('Invalid longitude');
  });

  it('should throw DataException when longitude is greater than 180', () => {
    expect(() => Location.create(0, 181)).toThrow(DataException);
    expect(() => Location.create(0, 181)).toThrow('Invalid longitude');
  });
});