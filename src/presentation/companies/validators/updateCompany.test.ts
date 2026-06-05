import { UpdateCompanySchema } from './updateCompany';

describe('UpdateCompanySchema', () => {
  it('should pass with a valid name', () => {
    const result = UpdateCompanySchema.safeParse({ name: 'Mi Empresa' });
    expect(result.success).toBe(true);
  });

  it('should pass with empty object', () => {
    const result = UpdateCompanySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty string', () => {
    const result = UpdateCompanySchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });
});
