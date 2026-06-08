import { UpdateSupplierSchema } from '@/presentation/suppliers/validators/updateSupplier';

describe('UpdateSupplierSchema', () => {
  it('should pass with a valid name', () => {
    const result = UpdateSupplierSchema.safeParse({ name: 'Proveedor S.A.' });
    expect(result.success).toBe(true);
  });

  it('should pass with empty object', () => {
    const result = UpdateSupplierSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty string', () => {
    const result = UpdateSupplierSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });
});
