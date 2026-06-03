import { RouteName } from '@/domain/routes/valueObjects/routeName.valueObject';
import DomainError from '@/domain/core/errors/DomainError';

describe('RouteName', () => {
  it('should create a RouteName with valid value', () => {
    const name = RouteName.create('Route One');

    expect(name.value).toBe('Route One');
  });

  it('should trim whitespace from value', () => {
    const name = RouteName.create('  Route Two  ');

    expect(name.value).toBe('Route Two');
  });

  it('should create RouteName with minimum valid length (2 characters)', () => {
    const name = RouteName.create('AB');

    expect(name.value).toBe('AB');
  });

  it('should create RouteName with 100 characters', () => {
    const name = RouteName.create('A'.repeat(100));

    expect(name.value).toHaveLength(100);
  });

  it('should check equality with equals', () => {
    const name1 = RouteName.create('Route One');
    const name2 = RouteName.create('Route One');
    const name3 = RouteName.create('Route Two');

    expect(name1.equals(name2)).toBe(true);
    expect(name1.equals(name3)).toBe(false);
  });

  it('should return the same value in toString', () => {
    const name = RouteName.create('Route One');

    expect(name.toString()).toBe('Route One');
  });

  it('should throw DomainError when value is empty', () => {
    expect(() => RouteName.create('')).toThrow(DomainError);
    expect(() => RouteName.create('')).toThrow('Route name cannot be empty');
  });

  it('should throw DomainError when value is only whitespace', () => {
    expect(() => RouteName.create('   ')).toThrow(DomainError);
  });

  it('should throw DomainError when value is less than 2 characters', () => {
    expect(() => RouteName.create('A')).toThrow(DomainError);
    expect(() => RouteName.create('A')).toThrow('Route name must be at least 2 characters long');
  });

  it('should throw DomainError when value exceeds 100 characters', () => {
    expect(() => RouteName.create('A'.repeat(101))).toThrow(DomainError);
    expect(() => RouteName.create('A'.repeat(101))).toThrow('Route name cannot be longer than 100 characters');
  });
});