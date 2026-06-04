import { ProductService } from '@/application/products/services/implementations/ProductService';
import { IProductService } from '@/application/products/services/interfaces/IProductService';
import { IProductRepository } from '@/domain/products/repositories/IProductRepository';
import { IProductDeletionUnitOfWork, IProductDeletionContext } from '@/domain/products/unitsOfWork/ProductDeletionUnitOfWork';
import { ProductCreationError } from '@/application/products/errors/ProductCreationError';
import { ProductNotFoundError } from '@/application/products/errors/ProductNotFoundError';
import { createProduct } from '@/tests/mocks/domain';

describe('ProductService', () => {
  let service: IProductService;
  let mockRepository: jest.Mocked<IProductRepository>;
  let mockUnitOfWork: jest.Mocked<IProductDeletionUnitOfWork>;

  beforeEach(() => {
    mockRepository = {
      all: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCompanyId: jest.fn(),
      findByName: jest.fn(),
      findByPriceRange: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    mockUnitOfWork = {
      runInTransaction: jest.fn(),
    } as jest.Mocked<IProductDeletionUnitOfWork>;

    service = new ProductService(mockRepository, mockUnitOfWork);
  });

  describe('create', () => {
    it('creates product and returns it', async () => {
      const product = createProduct();
      mockRepository.create.mockResolvedValue(product);

      const result = await service.create(product);

      expect(mockRepository.create).toHaveBeenCalledWith(product);
      expect(result).toBe(product);
    });
  });

  describe('find', () => {
    it('finds product by id by default', async () => {
      const product = createProduct();
      mockRepository.find.mockResolvedValue(product);

      const result = await service.find('product-1');

      expect(mockRepository.find).toHaveBeenCalledWith('product-1', 'id');
      expect(result).toBe(product);
    });

    it('finds product by custom field', async () => {
      const product = createProduct();
      mockRepository.find.mockResolvedValue(product);

      const result = await service.find('Test Product', 'name');

      expect(mockRepository.find).toHaveBeenCalledWith('Test Product', 'name');
      expect(result).toBe(product);
    });

    it('returns null when product not found', async () => {
      mockRepository.find.mockResolvedValue(null);

      const result = await service.find('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates product and returns updated version', async () => {
      const product = createProduct({ name: 'Updated Product' });
      const updatedProduct = createProduct({ name: 'Updated Product' });
      mockRepository.find.mockResolvedValue(product);
      mockRepository.update.mockResolvedValue();
      mockRepository.find.mockResolvedValue(updatedProduct);

      const result = await service.update(product);

      expect(mockRepository.update).toHaveBeenCalledWith(product);
      expect(result).toBe(updatedProduct);
    });

    it('throws ProductNotFoundError when product does not exist', async () => {
      const product = createProduct();
      mockRepository.find.mockResolvedValue(null);

      await expect(service.update(product)).rejects.toThrow(ProductNotFoundError);
    });

    it('throws ProductCreationError when update fails to return product', async () => {
      const product = createProduct();
      mockRepository.find
        .mockResolvedValueOnce(product)  // first call - product found
        .mockResolvedValueOnce(null);    // second call - product not found after update
      mockRepository.update.mockResolvedValue();

      await expect(service.update(product)).rejects.toThrow(ProductCreationError);
    });
  });

  describe('delete', () => {
    it('deletes product using unit of work', async () => {
      const mockContext = {
        getProductRepository: jest.fn().mockReturnValue(mockRepository),
        getOrderRepository: jest.fn(),
      } as unknown as IProductDeletionContext;

      mockRepository.find.mockResolvedValue(createProduct());
      mockRepository.delete.mockResolvedValue();
      mockUnitOfWork.runInTransaction.mockImplementation(async (work) => {
        return work(mockContext);
      });

      await service.delete('product-1');

      expect(mockUnitOfWork.runInTransaction).toHaveBeenCalled();
    });

    it('throws ProductNotFoundError when product does not exist', async () => {
      const mockContext = {
        getProductRepository: jest.fn().mockReturnValue(mockRepository),
        getOrderRepository: jest.fn(),
      } as unknown as IProductDeletionContext;

      mockRepository.find.mockResolvedValue(null);
      mockUnitOfWork.runInTransaction.mockImplementation(async (work) => {
        return work(mockContext);
      });

      await expect(service.delete('non-existent')).rejects.toThrow(ProductNotFoundError);
    });
  });

  describe('findAll', () => {
    it('returns all products', async () => {
      const products = [createProduct(), createProduct({ id: 'product-2' })];
      mockRepository.all.mockResolvedValue(products);

      const result = await service.findAll();

      expect(mockRepository.all).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('findByCompanyId', () => {
    it('returns products for company', async () => {
      const products = [createProduct(), createProduct({ id: 'product-2', companyId: 'company-1' })];
      mockRepository.findByCompanyId.mockResolvedValue(products);

      const result = await service.findByCompanyId('company-1');

      expect(mockRepository.findByCompanyId).toHaveBeenCalledWith('company-1');
      expect(result).toHaveLength(2);
    });
  });

  describe('findByName', () => {
    it('returns product found by name and company', async () => {
      const product = createProduct();
      mockRepository.findByName.mockResolvedValue(product);

      const result = await service.findByName('Test Product', 'company-1');

      expect(mockRepository.findByName).toHaveBeenCalledWith('Test Product', 'company-1');
      expect(result).toBe(product);
    });

    it('returns null when product not found by name', async () => {
      mockRepository.findByName.mockResolvedValue(null);

      const result = await service.findByName('Non-existent', 'company-1');

      expect(result).toBeNull();
    });
  });

  describe('findByPriceRange', () => {
    it('returns products within price range', async () => {
      const products = [createProduct(), createProduct({ id: 'product-2', grossPrice: 150 })];
      mockRepository.findByPriceRange.mockResolvedValue(products);

      const result = await service.findByPriceRange(50, 200, 'company-1');

      expect(mockRepository.findByPriceRange).toHaveBeenCalledWith(50, 200, 'company-1');
      expect(result).toHaveLength(2);
    });
  });
});