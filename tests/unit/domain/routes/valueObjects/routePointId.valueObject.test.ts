import { RoutePointId } from '@/domain/routes/valueObjects/routePointId.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('RoutePointId', () => {
  it('should create a RoutePointId with valid value', () => {
    const routePointId = RoutePointId.create('route-point-123');

    expect(routePointId.value).toBe('route-point-123');
  });

  it('should return the same value in toString', () => {
    const routePointId = RoutePointId.create('route-point-456');

    expect(routePointId.toString()).toBe('route-point-456');
  });

  it('should check equality with equals', () => {
    const routePointId1 = RoutePointId.create('route-point-123');
    const routePointId2 = RoutePointId.create('route-point-123');
    const routePointId3 = RoutePointId.create('route-point-456');

    expect(routePointId1.equals(routePointId2)).toBe(true);
    expect(routePointId1.equals(routePointId3)).toBe(false);
  });

  it('should throw DomainError when value is empty', () => {
    expect(() => RoutePointId.create('')).toThrow(DomainError);
    expect(() => RoutePointId.create('')).toThrow('RoutePointId cannot be empty');
  });

  it('should throw DomainError when value is only whitespace', () => {
    expect(() => RoutePointId.create('   ')).toThrow(DomainError);
  });
});