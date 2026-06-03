import { createRoute } from '@/tests/mocks/domain';
import { createRoutePoint } from '@/tests/mocks/domain';

describe('Route', () => {
  it('should create a route with valid properties', () => {
    const route = createRoute();

    expect(route.id).toBe('route-1');
    expect(route.name).toBe('Test Route');
    expect(route.status).toBe('CREATED');
    expect(route.companyId).toBe('company-1');
    expect(route.polyline).toBeNull();
    expect(route.points).toHaveLength(0);
    expect(route.createdAt).toBeInstanceOf(Date);
    expect(route.updatedAt).toBeInstanceOf(Date);
  });

  it('should return points as a copy for immutability', () => {
    const route = createRoute({ points: [createRoutePoint({ id: 'point-1' }), createRoutePoint({ id: 'point-2' })] });
    const pointsBefore = route.points;
    const pointsAfter = route.points;

    expect(pointsBefore).not.toBe(pointsAfter);
    expect(pointsBefore).toEqual(pointsAfter);
  });

  it('should set polyline correctly', () => {
    const route = createRoute();
    route.setPolyline('encoded-polyline-string');

    expect(route.polyline).toBe('encoded-polyline-string');
  });

  it('should set polyline to null', () => {
    const route = createRoute({ polyline: 'some-data' });
    route.setPolyline(null);

    expect(route.polyline).toBeNull();
  });

  it('should set status correctly', () => {
    const route = createRoute();
    route.setStatus('STARTED');

    expect(route.status).toBe('STARTED');
  });

  it('should create route with custom name', () => {
    const route = createRoute({ name: 'Custom Route' });

    expect(route.name).toBe('Custom Route');
  });

  it('should create route with custom points', () => {
    const points = [createRoutePoint({ id: 'point-1' }), createRoutePoint({ id: 'point-2' })];
    const route = createRoute({ points });

    expect(route.points).toHaveLength(2);
    expect(route.points[0].id).toBe('point-1');
    expect(route.points[1].id).toBe('point-2');
  });

  it('should create route with provided polyline', () => {
    const route = createRoute({ polyline: 'some-encoded-data' });

    expect(route.polyline).toBe('some-encoded-data');
  });

  it('should throw when created with empty id', () => {
    expect(() => createRoute({ id: '' })).toThrow();
  });

  it('should throw when created with empty companyId', () => {
    expect(() => createRoute({ companyId: '' })).toThrow();
  });

  it('should throw when created with invalid status', () => {
    expect(() => createRoute({ status: 'invalid-status' })).toThrow();
  });
});