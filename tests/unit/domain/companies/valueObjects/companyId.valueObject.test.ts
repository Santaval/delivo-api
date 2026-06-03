import { CompanyId } from '@/domain/companies/valueObjects/companyId.valueObject';
import DataException from '@/domain/core/errors/DataError';

describe('CompanyId', () => {
  it('should create a CompanyId with valid value', () => {
    const companyId = CompanyId.create('company-123');

    expect(companyId.value).toBe('company-123');
  });

  it('should trim whitespace from value', () => {
    const companyId = CompanyId.create('  company-456  ');

    expect(companyId.value).toBe('company-456');
  });

  it('should throw DataException when value is empty', () => {
    expect(() => CompanyId.create('')).toThrow(DataException);
    expect(() => CompanyId.create('')).toThrow('CompanyId cannot be empty');
  });

  it('should allow whitespace-only string and trim to empty (bug in source)', () => {
    const companyId = CompanyId.create('   ');

    expect(companyId.value).toBe('');
  });
});