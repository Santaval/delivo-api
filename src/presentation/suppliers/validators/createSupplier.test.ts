import { CreateSupplierSchema } from './createSupplier';

describe('CreateSupplierSchema', () => {
  it('should pass with valid data', () => {
    const result = CreateSupplierSchema.safeParse({
      name: 'Proveedor S.A.',
      companyId: 'comp-123',
    });
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty', () => {
    const result = CreateSupplierSchema.safeParse({ name: '', companyId: 'comp-123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });

  it('should fail when companyId is missing', () => {
    const result = CreateSupplierSchema.safeParse({ name: 'Proveedor' });
    expect(result.success).toBe(false);
  });
});
