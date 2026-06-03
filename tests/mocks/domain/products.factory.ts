import { Product } from '@/domain/products/entities/Product';
import { ProductConstructorProps } from '@/domain/products/entities/Product';

export const createProduct = (overrides: Partial<ProductConstructorProps> = {}): Product => {
  const props: ProductConstructorProps = {
    id: 'product-1',
    name: 'Test Product',
    grossPrice: 100,
    ivaRate: 13,
    companyId: 'company-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
  return new Product(props);
};