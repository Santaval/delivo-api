import { CompanyCreationError } from '@/application/companies/errors/CompanyCreationError';

describe('CompanyCreationError', () => {
  it('has correct default values', () => {
    const error = new CompanyCreationError();

    expect(error.message).toBe('Failed to create company');
    expect(error.name).toBe('CompanyCreationError');
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe('error');
    expect(error.isOperational).toBe(true);
    expect(error.layer).toBe('application');
  });

  it('accepts custom message', () => {
    const error = new CompanyCreationError('Custom company creation message');

    expect(error.message).toBe('Custom company creation message');
  });
});