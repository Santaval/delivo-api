import { CompanyService } from '@/application/companies/services/implementations/CompanyService';
import { ICompanyService } from '@/application/companies/services/interfaces/ICompanyService';
import { ICompanyRepository } from '@/domain/companies/repositories/ICompanyRepository';
import { CompanyCreationError } from '@/application/companies/errors/CompanyCreationError';
import { CompanyNotFoundError } from '@/application/companies/errors/CompanyNotFoundError';
import { createCompany } from '@/tests/mocks/domain';

describe('CompanyService', () => {
  let service: ICompanyService;
  let mockRepository: jest.Mocked<ICompanyRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      all: jest.fn(),
      addUser: jest.fn(),
    } as jest.Mocked<ICompanyRepository>;
    service = new CompanyService(mockRepository);
  });

  describe('create', () => {
    it('creates company, adds user, and returns company', async () => {
      const company = createCompany();
      mockRepository.create.mockResolvedValue(undefined);
      mockRepository.find.mockResolvedValue(company);
      mockRepository.addUser.mockResolvedValue(undefined);

      const result = await service.create(company, 'user-123');

      expect(mockRepository.create).toHaveBeenCalledWith(company);
      expect(mockRepository.find).toHaveBeenCalledWith(company.id, 'id');
      expect(mockRepository.addUser).toHaveBeenCalledWith(company.id, 'user-123');
      expect(result).toBe(company);
    });

    it('throws CompanyCreationError when company not found after creation', async () => {
      const company = createCompany();
      mockRepository.create.mockResolvedValue(undefined);
      mockRepository.find.mockResolvedValue(null);

      await expect(service.create(company, 'user-123')).rejects.toThrow(CompanyCreationError);
    });

    it('throws Error when repository throws during create', async () => {
      const company = createCompany();
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(company, 'user-123')).rejects.toThrow(Error);
    });
  });

  describe('find', () => {
    it('finds company by id by default', async () => {
      const company = createCompany();
      mockRepository.find.mockResolvedValue(company);

      const result = await service.find('company-1');

      expect(mockRepository.find).toHaveBeenCalledWith('company-1', 'id');
      expect(result).toBe(company);
    });

    it('finds company by custom field', async () => {
      const company = createCompany();
      mockRepository.find.mockResolvedValue(company);

      const result = await service.find('company-name', 'name');

      expect(mockRepository.find).toHaveBeenCalledWith('company-name', 'name');
      expect(result).toBe(company);
    });

    it('returns null when company not found', async () => {
      mockRepository.find.mockResolvedValue(null);

      const result = await service.find('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates company and returns updated version', async () => {
      const company = createCompany({ name: 'Updated Company' });
      const updatedCompany = createCompany({ name: 'Updated Company' });
      mockRepository.find.mockResolvedValue(company);
      mockRepository.update.mockResolvedValue();
      mockRepository.find.mockResolvedValue(updatedCompany);

      const result = await service.update(company);

      expect(mockRepository.update).toHaveBeenCalledWith(company);
      expect(result).toBe(updatedCompany);
    });

    it('throws CompanyNotFoundError when company does not exist', async () => {
      const company = createCompany();
      mockRepository.find.mockResolvedValue(null);

      await expect(service.update(company)).rejects.toThrow(CompanyNotFoundError);
    });

    it('throws CompanyCreationError when update fails to return company', async () => {
      const company = createCompany();
      mockRepository.find
        .mockResolvedValueOnce(company)  // first call - company found
        .mockResolvedValueOnce(null);   // second call - company not found after update
      mockRepository.update.mockResolvedValue();

      await expect(service.update(company)).rejects.toThrow(CompanyCreationError);
    });
  });

  describe('delete', () => {
    it('deletes existing company', async () => {
      const company = createCompany();
      mockRepository.find.mockResolvedValue(company);
      mockRepository.delete.mockResolvedValue();

      await service.delete('company-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('company-1');
    });

    it('throws CompanyNotFoundError when company does not exist', async () => {
      mockRepository.find.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(CompanyNotFoundError);
    });
  });

  describe('findAll', () => {
    it('returns all companies', async () => {
      const companies = [createCompany(), createCompany({ id: 'company-2' })];
      mockRepository.all.mockResolvedValue(companies);

      const result = await service.findAll();

      expect(mockRepository.all).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });
});