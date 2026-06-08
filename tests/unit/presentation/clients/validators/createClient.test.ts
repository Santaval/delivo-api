import { CreateClientSchema } from '@/presentation/clients/validators/createClient';

describe('CreateClientSchema', () => {
  it('should pass with valid data', () => {
    const result = CreateClientSchema.safeParse({
      name: 'Juan Pérez',
      phoneNumber: '12345678',
      email: 'juan@test.com',
      lat: 10.5,
      lng: -66.8,
    });
    expect(result.success).toBe(true);
  });

  it('should pass with minimal valid data', () => {
    const result = CreateClientSchema.safeParse({
      name: 'Juan',
      lat: null,
      lng: null,
    });
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty', () => {
    const result = CreateClientSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });

  it('should fail when name is missing', () => {
    const result = CreateClientSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should fail with invalid email', () => {
    const result = CreateClientSchema.safeParse({ name: 'Juan', email: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});
