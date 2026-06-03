import LocationDescription from '@/domain/geolocation/valueObjects/LocationDescription.valueObject';
import DataError from '@/domain/core/errors/DataError';

describe('LocationDescription', () => {
  it('should create a LocationDescription with valid value', () => {
    const description = LocationDescription.create('123 Main Street');

    expect(description.value).toBe('123 Main Street');
  });

  it('should create LocationDescription with single character', () => {
    const description = LocationDescription.create('A');

    expect(description.value).toBe('A');
  });

  it('should create LocationDescription with maximum allowed length', () => {
    const longText = 'a'.repeat(255);
    const description = LocationDescription.create(longText);

    expect(description.value).toHaveLength(255);
  });

  it('should throw DataError when value is empty', () => {
    expect(() => LocationDescription.create('')).toThrow(DataError);
    expect(() => LocationDescription.create('')).toThrow('Location description cannot be empty');
  });

  it('should throw DataError when value is only whitespace', () => {
    expect(() => LocationDescription.create('   ')).toThrow(DataError);
  });

  it('should throw DataError when value exceeds 255 characters', () => {
    const longText = 'a'.repeat(256);
    expect(() => LocationDescription.create(longText)).toThrow(DataError);
    expect(() => LocationDescription.create(longText)).toThrow('Location description cannot exceed 255 characters');
  });
});