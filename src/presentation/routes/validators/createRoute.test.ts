import createRouteSchema from './createRoute';

describe('createRouteSchema', () => {
  it('should pass with valid name', () => {
    const result = createRouteSchema.safeParse({ name: 'Ruta Norte' });
    expect(result.success).toBe(true);
  });

  it('should fail when name is too short', () => {
    const result = createRouteSchema.safeParse({ name: 'A' });
    expect(result.success).toBe(false);
  });

  it('should fail when name is missing', () => {
    const result = createRouteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
