import { RoutePointStatus, RoutePointStatusType } from '@/domain/routes/valueObjects/routePointStatus.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('RoutePointStatus', () => {
  it('should create RoutePointStatus with CREATED value', () => {
    const status = RoutePointStatus.create('CREATED');

    expect(status.value).toBe('CREATED');
  });

  it('should create RoutePointStatus with VISITED value', () => {
    const status = RoutePointStatus.create('VISITED');

    expect(status.value).toBe('VISITED');
  });

  it('should create RoutePointStatus with SKIPPED value', () => {
    const status = RoutePointStatus.create('SKIPPED');

    expect(status.value).toBe('SKIPPED');
  });

  it('should create status using created factory', () => {
    const status = RoutePointStatus.created();

    expect(status.value).toBe('CREATED');
    expect(status.isCreated()).toBe(true);
  });

  it('should create status using visited factory', () => {
    const status = RoutePointStatus.visited();

    expect(status.value).toBe('VISITED');
    expect(status.isVisited()).toBe(true);
  });

  it('should create status using skipped factory', () => {
    const status = RoutePointStatus.skipped();

    expect(status.value).toBe('SKIPPED');
    expect(status.isSkipped()).toBe(true);
  });

  it('should return correct value for isCreated', () => {
    const created = RoutePointStatus.created();
    const visited = RoutePointStatus.visited();

    expect(created.isCreated()).toBe(true);
    expect(visited.isCreated()).toBe(false);
  });

  it('should return correct value for isVisited', () => {
    const visited = RoutePointStatus.visited();
    const created = RoutePointStatus.created();

    expect(visited.isVisited()).toBe(true);
    expect(created.isVisited()).toBe(false);
  });

  it('should return correct value for isSkipped', () => {
    const skipped = RoutePointStatus.skipped();
    const created = RoutePointStatus.created();

    expect(skipped.isSkipped()).toBe(true);
    expect(created.isSkipped()).toBe(false);
  });

  it('should check equality with equals', () => {
    const status1 = RoutePointStatus.create('CREATED');
    const status2 = RoutePointStatus.create('CREATED');
    const status3 = RoutePointStatus.create('VISITED');

    expect(status1.equals(status2)).toBe(true);
    expect(status1.equals(status3)).toBe(false);
  });

  it('should return correct string representation', () => {
    const status = RoutePointStatus.create('CREATED');

    expect(status.toString()).toBe('CREATED');
  });

  describe('canTransitionTo', () => {
    it('should allow CREATED to transition to VISITED', () => {
      const created = RoutePointStatus.created();
      const visited = RoutePointStatus.visited();

      expect(created.canTransitionTo(visited)).toBe(true);
    });

    it('should allow CREATED to transition to SKIPPED', () => {
      const created = RoutePointStatus.created();
      const skipped = RoutePointStatus.skipped();

      expect(created.canTransitionTo(skipped)).toBe(true);
    });

    it('should not allow VISITED to transition to any status', () => {
      const visited = RoutePointStatus.visited();
      const skipped = RoutePointStatus.skipped();

      expect(visited.canTransitionTo(skipped)).toBe(false);
    });

    it('should allow SKIPPED to transition to VISITED', () => {
      const skipped = RoutePointStatus.skipped();
      const visited = RoutePointStatus.visited();

      expect(skipped.canTransitionTo(visited)).toBe(true);
    });

    it('should not allow SKIPPED to transition to CREATED', () => {
      const skipped = RoutePointStatus.skipped();
      const created = RoutePointStatus.created();

      expect(skipped.canTransitionTo(created)).toBe(false);
    });
  });

  it('should throw DomainError for invalid status', () => {
    expect(() => RoutePointStatus.create('INVALID')).toThrow(DomainError);
    expect(() => RoutePointStatus.create('INVALID')).toThrow('Invalid route point status');
  });
});