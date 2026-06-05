import { CreateCompanySchema } from './createCompany';

describe('CreateCompanySchema', () => {
  it('should pass with a valid name', () => {
    const result = CreateCompanySchema.safeParse({ name: 'Mi Empresa' });
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty', () => {
    const result = CreateCompanySchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });

  it('should fail when name is missing', () => {
    const result = CreateCompanySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
