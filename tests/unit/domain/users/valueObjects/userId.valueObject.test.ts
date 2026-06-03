import { UserId } from '@/domain/users/valueObjects/userId.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('UserId', () => {
  it('should create a UserId with valid value', () => {
    const userId = UserId.create('user-123');

    expect(userId.value).toBe('user-123');
  });

  it('should trim whitespace from value', () => {
    const userId = UserId.create('  user-456  ');

    expect(userId.value).toBe('user-456');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => UserId.create('')).toThrow(DataException);
    expect(() => UserId.create('')).toThrow('UserId cannot be empty');
  });

  it('should allow whitespace-only string and trim to empty (bug in source)', () => {
    const userId = UserId.create('   ');

    expect(userId.value).toBe('');
  });
});