import { RouteStatus, RouteStatusType } from '@/domain/routes/valueObjects/routeStatus.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('RouteStatus', () => {
  it('should create RouteStatus with CREATED value', () => {
    const status = RouteStatus.create('CREATED');

    expect(status.value).toBe('CREATED');
  });

  it('should create RouteStatus with STARTED value', () => {
    const status = RouteStatus.create('STARTED');

    expect(status.value).toBe('STARTED');
  });

  it('should create RouteStatus with COMPLETED value', () => {
    const status = RouteStatus.create('COMPLETED');

    expect(status.value).toBe('COMPLETED');
  });

  it('should create status using created factory', () => {
    const status = RouteStatus.created();

    expect(status.value).toBe('CREATED');
    expect(status.isCreated()).toBe(true);
  });

  it('should create status using started factory', () => {
    const status = RouteStatus.started();

    expect(status.value).toBe('STARTED');
    expect(status.isStarted()).toBe(true);
  });

  it('should create status using completed factory', () => {
    const status = RouteStatus.completed();

    expect(status.value).toBe('COMPLETED');
    expect(status.isCompleted()).toBe(true);
  });

  it('should return correct value for isCreated', () => {
    const created = RouteStatus.created();
    const started = RouteStatus.started();

    expect(created.isCreated()).toBe(true);
    expect(started.isCreated()).toBe(false);
  });

  it('should return correct value for isStarted', () => {
    const started = RouteStatus.started();
    const created = RouteStatus.created();

    expect(started.isStarted()).toBe(true);
    expect(created.isStarted()).toBe(false);
  });

  it('should return correct value for isCompleted', () => {
    const completed = RouteStatus.completed();
    const created = RouteStatus.created();

    expect(completed.isCompleted()).toBe(true);
    expect(created.isCompleted()).toBe(false);
  });

  it('should check equality with equals', () => {
    const status1 = RouteStatus.create('CREATED');
    const status2 = RouteStatus.create('CREATED');
    const status3 = RouteStatus.create('STARTED');

    expect(status1.equals(status2)).toBe(true);
    expect(status1.equals(status3)).toBe(false);
  });

  it('should return correct string representation', () => {
    const status = RouteStatus.create('CREATED');

    expect(status.toString()).toBe('CREATED');
  });

  describe('canTransitionTo', () => {
    it('should allow CREATED to transition to STARTED', () => {
      const created = RouteStatus.created();
      const started = RouteStatus.started();

      expect(created.canTransitionTo(started)).toBe(true);
    });

    it('should not allow CREATED to transition to COMPLETED', () => {
      const created = RouteStatus.created();
      const completed = RouteStatus.completed();

      expect(created.canTransitionTo(completed)).toBe(false);
    });

    it('should allow STARTED to transition to COMPLETED', () => {
      const started = RouteStatus.started();
      const completed = RouteStatus.completed();

      expect(started.canTransitionTo(completed)).toBe(true);
    });

    it('should not allow STARTED to transition to CREATED', () => {
      const started = RouteStatus.started();
      const created = RouteStatus.created();

      expect(started.canTransitionTo(created)).toBe(false);
    });

    it('should not allow COMPLETED to transition to any status', () => {
      const completed = RouteStatus.completed();
      const created = RouteStatus.created();
      const started = RouteStatus.started();

      expect(completed.canTransitionTo(created)).toBe(false);
      expect(completed.canTransitionTo(started)).toBe(false);
    });
  });

  it('should throw DomainError for invalid status', () => {
    expect(() => RouteStatus.create('INVALID')).toThrow(DomainError);
    expect(() => RouteStatus.create('INVALID')).toThrow('Invalid route status');
  });
});