import { UpdateUserSchema } from '@/presentation/users/validators/updateUser';

describe('UpdateUserSchema', () => {
  it('should pass with valid data', () => {
    const result = UpdateUserSchema.safeParse({
      name: 'Juan',
      surnames: 'Pérez',
      birthdate: '1990-01-01',
      gender: 'male',
    });
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty', () => {
    const result = UpdateUserSchema.safeParse({
      name: '',
      surnames: 'Pérez',
      birthdate: '1990-01-01',
      gender: 'male',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('El nombre es requerido');
    }
  });

  it('should fail with invalid gender', () => {
    const result = UpdateUserSchema.safeParse({
      name: 'Juan',
      surnames: 'Pérez',
      birthdate: '1990-01-01',
      gender: 'unknown',
    });
    expect(result.success).toBe(false);
  });
});
