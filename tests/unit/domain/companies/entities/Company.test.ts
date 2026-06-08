import { createCompany } from '@/tests/mocks/domain';
import { Company } from '@/domain/companies/entities/Company';

describe('Company', () => {
  it('should create a company with valid properties', () => {
    const company = createCompany();

    expect(company.id).toBe('company-1');
    expect(company.name).toBe('Test Company');
    expect(company.createdAt).toBeInstanceOf(Date);
    expect(company.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a company with custom name', () => {
    const company = createCompany({ name: 'Custom Company' });

    expect(company.name).toBe('Custom Company');
    expect(company.id).toBe('company-1');
  });

  it('should update id via setter', () => {
    const company = createCompany();
    company.id = 'company-2';

    expect(company.id).toBe('company-2');
  });

  it('should update name via setter', () => {
    const company = createCompany();
    company.name = 'Updated Company';

    expect(company.name).toBe('Updated Company');
  });

  it('should update updatedAt via setter', () => {
    const company = createCompany();
    const newDate = new Date('2025-01-01T00:00:00.000Z');
    company.updatedAt = newDate;

    expect(company.updatedAt).toEqual(newDate);
  });

  it('should parse ISO date strings correctly', () => {
    const company = createCompany({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(company.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(company.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should throw when created with empty id', () => {
    expect(() => createCompany({ id: '' })).toThrow();
  });
});