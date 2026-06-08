import { createProduct } from '@/tests/mocks/domain';

describe('Product', () => {
  it('should create a product with valid properties', () => {
    const product = createProduct();

    expect(product.id).toBe('product-1');
    expect(product.name).toBe('Test Product');
    expect(product.companyId).toBe('company-1');
    expect(product.pricing.grossPrice).toBe(100);
    expect(product.pricing.ivaRate).toBe(13);
    expect(product.createdAt).toBeInstanceOf(Date);
    expect(product.updatedAt).toBeInstanceOf(Date);
    expect(product.deletedAt).toBeNull();
  });

  it('should create a product with custom properties', () => {
    const product = createProduct({
      name: 'Custom Product',
      grossPrice: 200,
      ivaRate: 21,
    });

    expect(product.name).toBe('Custom Product');
    expect(product.pricing.grossPrice).toBe(200);
    expect(product.pricing.ivaRate).toBe(21);
  });

  it('should calculate iva amount correctly (grossPrice=100, ivaRate=13)', () => {
    const product = createProduct({ grossPrice: 100, ivaRate: 13 });

    expect(product.ivaAmount).toBeCloseTo(11.50, 1);
  });

  it('should create a product with deletedAt set', () => {
    const product = createProduct({ deletedAt: '2024-01-01T00:00:00.000Z' });

    expect(product.deletedAt).toBeInstanceOf(Date);
    expect(product.deletedAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
  });

  it('should create a product with string grossPrice', () => {
    const product = createProduct({ grossPrice: '250' });

    expect(product.pricing.grossPrice).toBe(250);
  });

  it('should create a product with string ivaRate', () => {
    const product = createProduct({ ivaRate: '10' });

    expect(product.pricing.ivaRate).toBe(10);
  });

  it('should parse ISO date strings correctly', () => {
    const product = createProduct({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(product.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(product.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should throw when created with empty id', () => {
    expect(() => createProduct({ id: '' })).toThrow();
  });

  it('should throw when created with empty companyId', () => {
    expect(() => createProduct({ companyId: '' })).toThrow();
  });

  it('should throw when created with negative gross price', () => {
    expect(() => createProduct({ grossPrice: -10 })).toThrow();
  });

  it('should throw when created with invalid iva rate', () => {
    expect(() => createProduct({ ivaRate: 101 })).toThrow();
  });
});