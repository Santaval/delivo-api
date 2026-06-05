import { Company } from '@/domain/companies/entities/Company';
import CompanyDtoMapper from './Company.mapper';
import { CreateCompanyRequest } from '../requests/CreateCompanyRequest';
import { UpdateCompanyRequest } from '../requests/UpdateCompanyRequest';

describe('CompanyDtoMapper', () => {
  const mockIdGenerator = { generate: () => 'gen-id-123' };

  describe('fromCreateRequest', () => {
    it('should map CreateCompanyRequest to Company', () => {
      const request: CreateCompanyRequest = { name: 'New Company' };
      const company = CompanyDtoMapper.fromCreateRequest(request, mockIdGenerator as any);
      expect(company).toBeInstanceOf(Company);
      expect(company.name).toBe('New Company');
      expect(company.id).toBe('gen-id-123');
    });
  });

  describe('fromUpdateRequest', () => {
    it('should map UpdateCompanyRequest to Company', () => {
      const request: UpdateCompanyRequest = { id: 'comp-1', name: 'Updated' };
      const company = CompanyDtoMapper.fromUpdateRequest(request);
      expect(company.id).toBe('comp-1');
      expect(company.name).toBe('Updated');
    });
  });

  describe('toResponse', () => {
    it('should map Company to CompanyResponse', () => {
      const company = new Company({
        id: 'comp-1',
        name: 'Test Company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const response = CompanyDtoMapper.toResponse(company);
      expect(response.id).toBe('comp-1');
      expect(response.name).toBe('Test Company');
    });
  });

  describe('toResponseArray', () => {
    it('should map array of Companies', () => {
      const companies = [
        new Company({ id: 'c1', name: 'A', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
      ];
      const responses = CompanyDtoMapper.toResponseArray(companies);
      expect(responses).toHaveLength(1);
      expect(responses[0].name).toBe('A');
    });
  });
});
