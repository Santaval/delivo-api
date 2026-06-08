import { Request } from 'express';
import CompanyIdParser from '@/presentation/core/utils/companyIdParser';

describe('CompanyIdParser', () => {
  it('should return the x-company-id header value', () => {
    const req = { headers: { 'x-company-id': 'company-123' } } as unknown as Request;
    expect(CompanyIdParser(req)).toBe('company-123');
  });

  it('should return undefined when header is missing', () => {
    const req = { headers: {} } as unknown as Request;
    expect(CompanyIdParser(req)).toBeUndefined();
  });
});
