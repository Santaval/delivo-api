import { GoogleLoginSchema } from './googleLogin';

describe('GoogleLoginSchema', () => {
  it('should pass with a non-empty token string', () => {
    const result = GoogleLoginSchema.safeParse({ token: 'abc123' });
    expect(result.success).toBe(true);
  });

  it('should fail when token is empty', () => {
    const result = GoogleLoginSchema.safeParse({ token: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Token de Google no puede estar vacío');
    }
  });

  it('should fail when token is missing', () => {
    const result = GoogleLoginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
