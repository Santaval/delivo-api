import { Product } from '@/domain/products/entities/Product';
import ProductDtoMapper from '@/presentation/products/mappers/Product.mapper';
import { CreateProductRequest } from '@/presentation/products/requests/CreateProductRequest';
import { UpdateProductRequest } from '@/presentation/products/requests/UpdateProductRequest';

describe('ProductDtoMapper', () => {
  const baseProductProps = {
    id: 'prod-1',
    name: 'Test Product',
    grossPrice: 100,
    ivaRate: 13,
    companyId: 'comp-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  };

  describe('fromCreateRequest', () => {
    it('should map CreateProductRequest to Product', () => {
      const request: CreateProductRequest = { name: 'New Product', grossPrice: 200 };
      const product = ProductDtoMapper.fromCreateRequest(request, 'comp-1');
      expect(product).toBeInstanceOf(Product);
      expect(product.name).toBe('New Product');
      expect(product.pricing.grossPrice).toBe(200);
      expect(product.companyId).toBe('comp-1');
    });

    it('should default ivaRate to 13', () => {
      const request: CreateProductRequest = { name: 'Product', grossPrice: 100 };
      const product = ProductDtoMapper.fromCreateRequest(request, 'comp-1');
      expect(product.pricing.ivaRate).toBe(13);
    });
  });

  describe('fromUpdateRequest', () => {
    it('should merge request with existing product', () => {
      const existing = new Product(baseProductProps);
      const request: UpdateProductRequest = { id: 'prod-1', name: 'Updated' };
      const updated = ProductDtoMapper.fromUpdateRequest(request, existing);
      expect(updated.name).toBe('Updated');
      expect(updated.pricing.grossPrice).toBe(100);
    });
  });

  describe('toResponse', () => {
    it('should map Product to ProductResponse', () => {
      const product = new Product(baseProductProps);
      const response = ProductDtoMapper.toResponse(product);
      expect(response.id).toBe('prod-1');
      expect(response.name).toBe('Test Product');
      expect(response.pricing.netPrice).toBe(product.pricing.netPrice);
      expect(response.createdAt).toBe(product.createdAt.toISOString());
    });
  });

  describe('toResponseArray', () => {
    it('should map array of Products', () => {
      const products = [new Product(baseProductProps)];
      const responses = ProductDtoMapper.toResponseArray(products);
      expect(responses).toHaveLength(1);
      expect(responses[0].id).toBe('prod-1');
    });
  });
});
