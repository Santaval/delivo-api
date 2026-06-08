import { UpdateProductSchema } from './updateProduct';

describe('UpdateProductSchema', () => {
  it('should pass with valid data', () => {
    const result = UpdateProductSchema.safeParse({
      name: 'Producto Actualizado',
      ivaRate: 10,
      grossPrice: 200,
    });
    expect(result.success).toBe(true);
  });

  it('should pass with empty object', () => {
    const result = UpdateProductSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty string', () => {
    const result = UpdateProductSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });

  it('should fail when ivaRate is negative', () => {
    const result = UpdateProductSchema.safeParse({ ivaRate: -1 });
    expect(result.success).toBe(false);
  });
});
