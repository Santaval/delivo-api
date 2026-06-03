import { Company } from '@/domain/companies/entities/Company';
import { CompanyConstructorProps } from '@/domain/companies/entities/Company';

export const createCompany = (overrides: Partial<CompanyConstructorProps> = {}): Company => {
  const props: CompanyConstructorProps = {
    id: 'company-1',
    name: 'Test Company',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
  return new Company(props);
};