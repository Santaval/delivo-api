import { ClientId } from '@/domain/clients/valueObjects/clientId.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('ClientId', () => {
  it('should create a ClientId with valid value', () => {
    const clientId = ClientId.create('client-123');

    expect(clientId.value).toBe('client-123');
  });

  it('should trim whitespace from value', () => {
    const clientId = ClientId.create('  client-456  ');

    expect(clientId.value).toBe('client-456');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => ClientId.create('')).toThrow(DataException);
    expect(() => ClientId.create('')).toThrow('ClientId cannot be empty');
  });

  it('should throw DataException when value is only whitespace', () => {
    expect(() => ClientId.create('   ')).toThrow(DataException);
  });
});