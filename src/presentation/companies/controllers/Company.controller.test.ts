import { Request, Response } from 'express';
import CompanyController from './Company.controller';
import { ICompanyService } from '@/application/companies/services/interfaces/ICompanyService';
import { Company } from '@/domain/companies/entities/Company';
import { IIDGenerator } from '@/domain/core/services/IIDGenerator';

describe('CompanyController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const createCompany = (): Company =>
    new Company({
      id: 'comp-1',
      name: 'Test Company',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

  let companyService: jest.Mocked<ICompanyService>;
  let idGenerator: jest.Mocked<IIDGenerator>;
  let controller: CompanyController;

  beforeEach(() => {
    companyService = {
      create: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    idGenerator = { generate: jest.fn().mockReturnValue('gen-id') } as any;
    controller = new CompanyController(companyService, idGenerator);
  });

  describe('create', () => {
    it('should create a company and return 200', async () => {
      const company = createCompany();
      companyService.create.mockResolvedValue(company);
      const req = { body: { name: 'New Company' }, user: { id: 'user-1' } } as unknown as Request;
      const res = mockRes();
      await controller.create(req, res);
      expect(companyService.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'comp-1' }));
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      companyService.findAll.mockResolvedValue([createCompany()]);
      const req = {} as Request;
      const res = mockRes();
      await controller.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('findById', () => {
    it('should return company when found', async () => {
      companyService.find.mockResolvedValue(createCompany());
      const req = { params: { id: 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'comp-1' }));
    });

    it('should return 404 when not found', async () => {
      companyService.find.mockResolvedValue(null as any);
      const req = { params: { id: 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('update', () => {
    it('should update and return company', async () => {
      const company = createCompany();
      companyService.update.mockResolvedValue(company);
      const req = { params: { id: 'comp-1' }, body: { name: 'Updated' } } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'comp-1' }));
    });
  });

  describe('delete', () => {
    it('should delete and return 204', async () => {
      companyService.delete.mockResolvedValue(undefined);
      const req = { params: { id: 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
