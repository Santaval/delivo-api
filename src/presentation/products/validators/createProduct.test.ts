import { CreateProductSchema } from './createProduct';

describe('CreateProductSchema', () => {
  it('should pass with valid data', () => {
    const result = CreateProductSchema.safeParse({
      name: 'Producto A',
      ivaRate: 13,
      grossPrice: 100,
    });
    expect(result.success).toBe(true);
  });

  it('should pass without optional ivaRate', () => {
    const result = CreateProductSchema.safeParse({
      name: 'Producto B',
      grossPrice: 50,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ivaRate).toBe(13);
    }
  });

  it('should fail when name is empty', () => {
    const result = CreateProductSchema.safeParse({ name: '', grossPrice: 100 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });

  it('should fail when grossPrice is missing', () => {
    const result = CreateProductSchema.safeParse({ name: 'Producto' });
    expect(result.success).toBe(false);
  });

  it('should fail when ivaRate exceeds 100', () => {
    const result = CreateProductSchema.safeParse({ name: 'Producto', grossPrice: 100, ivaRate: 101 });
    expect(result.success).toBe(false);
  });
});
