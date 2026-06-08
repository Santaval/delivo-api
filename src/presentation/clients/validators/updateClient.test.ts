import { UpdateClientSchema } from './updateClient';

describe('UpdateClientSchema', () => {
  it('should pass with valid data', () => {
    const result = UpdateClientSchema.safeParse({
      name: 'Juan Pérez',
      phoneNumber: '12345678',
      email: 'juan@test.com',
      lat: 10.5,
      lng: -66.8,
    });
    expect(result.success).toBe(true);
  });

  it('should pass with lat and lng null', () => {
    const result = UpdateClientSchema.safeParse({ lat: null, lng: null });
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty string', () => {
    const result = UpdateClientSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre no puede estar vacío');
    }
  });
});
