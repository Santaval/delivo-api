import startRouteSchema from '@/presentation/routes/validators/startRoute';

describe('startRouteSchema', () => {
  it('should pass with valid startLocation', () => {
    const result = startRouteSchema.safeParse({
      startLocation: { lat: 10.5, lng: -66.8 },
    });
    expect(result.success).toBe(true);
  });

  it('should fail when lat is out of range', () => {
    const result = startRouteSchema.safeParse({
      startLocation: { lat: 91, lng: 0 },
    });
    expect(result.success).toBe(false);
  });

  it('should fail when lng is out of range', () => {
    const result = startRouteSchema.safeParse({
      startLocation: { lat: 0, lng: 181 },
    });
    expect(result.success).toBe(false);
  });

  it('should fail when startLocation is missing', () => {
    const result = startRouteSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
