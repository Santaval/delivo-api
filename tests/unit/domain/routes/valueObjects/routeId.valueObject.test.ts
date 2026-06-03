import { RouteId } from '@/domain/routes/valueObjects/routeId.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('RouteId', () => {
  it('should create a RouteId with valid value', () => {
    const routeId = RouteId.create('route-123');

    expect(routeId.value).toBe('route-123');
  });

  it('should return the same value in toString', () => {
    const routeId = RouteId.create('route-456');

    expect(routeId.toString()).toBe('route-456');
  });

  it('should check equality with equals', () => {
    const routeId1 = RouteId.create('route-123');
    const routeId2 = RouteId.create('route-123');
    const routeId3 = RouteId.create('route-456');

    expect(routeId1.equals(routeId2)).toBe(true);
    expect(routeId1.equals(routeId3)).toBe(false);
  });

  it('should throw DomainError when value is empty', () => {
    expect(() => RouteId.create('')).toThrow(DomainError);
    expect(() => RouteId.create('')).toThrow('RouteId cannot be empty');
  });

  it('should throw DomainError when value is only whitespace', () => {
    expect(() => RouteId.create('   ')).toThrow(DomainError);
  });
});