import { CompanyNotFoundError } from '@/application/companies/errors/CompanyNotFoundError';

describe('CompanyNotFoundError', () => {
  it('has correct default values', () => {
    const error = new CompanyNotFoundError();

    expect(error.message).toBe('Company not found');
    expect(error.name).toBe('CompanyNotFoundError');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });
});