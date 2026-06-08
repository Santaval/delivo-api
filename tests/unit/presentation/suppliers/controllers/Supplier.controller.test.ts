import { Request, Response } from 'express';
import SupplierController from '@/presentation/suppliers/controllers/Supplier.controller';
import { ISupplierService } from '@/application/suppliers/services/interfaces/ISupplierService';
import { Supplier } from '@/domain/suppliers/entities/Supplier';
import { IIDGenerator } from '@/domain/core/services/IIDGenerator';

describe('SupplierController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const createSupplier = (): Supplier =>
    new Supplier({
      id: 'sup-1',
      name: 'Supplier A',
      companyId: 'comp-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

  let supplierService: jest.Mocked<ISupplierService>;
  let idGenerator: jest.Mocked<IIDGenerator>;
  let controller: SupplierController;

  beforeEach(() => {
    supplierService = {
      create: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn(),
      findByCompanyId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    idGenerator = { generate: jest.fn().mockReturnValue('gen-id') } as any;
    controller = new SupplierController(supplierService, idGenerator);
  });

  describe('create', () => {
    it('should create supplier and return 201', async () => {
      supplierService.create.mockResolvedValue(createSupplier());
      const req = { body: { name: 'New Supplier', companyId: 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'sup-1' }));
    });
  });

  describe('findAll', () => {
    it('should return all suppliers', async () => {
      supplierService.findAll.mockResolvedValue([createSupplier()]);
      const req = {} as Request;
      const res = mockRes();
      await controller.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('findById', () => {
    it('should return supplier when found', async () => {
      supplierService.find.mockResolvedValue(createSupplier());
      const req = { params: { id: 'sup-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'sup-1' }));
    });

    it('should return 404 when not found', async () => {
      supplierService.find.mockResolvedValue(null as any);
      const req = { params: { id: 'sup-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('findByCompany', () => {
    it('should return suppliers for company', async () => {
      supplierService.findByCompanyId.mockResolvedValue([createSupplier()]);
      const req = { params: { companyId: 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findByCompany(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('update', () => {
    it('should update and return supplier', async () => {
      const supplier = createSupplier();
      supplierService.find.mockResolvedValue(supplier);
      supplierService.update.mockResolvedValue(supplier);
      const req = { params: { id: 'sup-1' }, body: { name: 'Updated' } } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'sup-1' }));
    });

    it('should return 404 when supplier not found', async () => {
      supplierService.find.mockResolvedValue(null as any);
      const req = { params: { id: 'sup-1' }, body: {} } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    it('should delete and return 204', async () => {
      supplierService.delete.mockResolvedValue(undefined);
      const req = { params: { id: 'sup-1' } } as unknown as Request;
      const res = mockRes();
      await controller.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
