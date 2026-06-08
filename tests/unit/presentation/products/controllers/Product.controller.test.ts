import { Request, Response } from 'express';
import ProductController from '@/presentation/products/controllers/Product.controller';
import { IProductService } from '@/application/products/services/interfaces/IProductService';
import { Product } from '@/domain/products/entities/Product';

describe('ProductController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const createProduct = (overrides?: Partial<any>): Product =>
    new Product({
      id: 'prod-1',
      name: 'Test Product',
      grossPrice: 100,
      ivaRate: 13,
      companyId: 'comp-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      ...overrides,
    });

  let productService: jest.Mocked<IProductService>;
  let controller: ProductController;

  beforeEach(() => {
    productService = {
      create: jest.fn(),
      findAll: jest.fn(),
      find: jest.fn(),
      findByCompanyId: jest.fn(),
      findByPriceRange: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    controller = new ProductController(productService);
  });

  describe('create', () => {
    it('should create a product and return 201', async () => {
      const product = createProduct();
      productService.create.mockResolvedValue(product);
      const req = { body: { name: 'New Product', grossPrice: 200 }, headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.create(req, res);
      expect(productService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-1' }));
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      productService.findAll.mockResolvedValue([createProduct()]);
      const req = {} as Request;
      const res = mockRes();
      await controller.findAll(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      productService.find.mockResolvedValue(createProduct());
      const req = { params: { id: 'prod-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-1' }));
    });

    it('should return 404 when not found', async () => {
      productService.find.mockResolvedValue(null as any);
      const req = { params: { id: 'prod-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('findByCompany', () => {
    it('should return products for company', async () => {
      productService.findByCompanyId.mockResolvedValue([createProduct()]);
      const req = { headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findByCompany(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('findByPriceRange', () => {
    it('should return products in price range', async () => {
      productService.findByPriceRange.mockResolvedValue([createProduct()]);
      const req = { params: { companyId: 'comp-1' }, query: { minPrice: '10', maxPrice: '200' } } as unknown as Request;
      const res = mockRes();
      await controller.findByPriceRange(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it('should return 400 when minPrice or maxPrice is missing', async () => {
      const req = { params: { companyId: 'comp-1' }, query: {} } as unknown as Request;
      const res = mockRes();
      await controller.findByPriceRange(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('update', () => {
    it('should update and return product', async () => {
      const product = createProduct();
      productService.find.mockResolvedValue(product);
      productService.update.mockResolvedValue(product);
      const req = { params: { id: 'prod-1' }, body: { name: 'Updated' } } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'prod-1' }));
    });

    it('should return 404 when product not found', async () => {
      productService.find.mockResolvedValue(null as any);
      const req = { params: { id: 'prod-1' }, body: {} } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    it('should delete and return 204', async () => {
      productService.delete.mockResolvedValue(undefined);
      const req = { params: { id: 'prod-1' } } as unknown as Request;
      const res = mockRes();
      await controller.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
