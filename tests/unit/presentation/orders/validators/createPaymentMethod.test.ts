import createPaymentMethodSchema from '@/presentation/orders/validators/createPaymentMethod';

describe('createPaymentMethodSchema', () => {
  it('should pass with valid name', () => {
    const result = createPaymentMethodSchema.safeParse({ name: 'Tarjeta' });
    expect(result.success).toBe(true);
  });

  it('should fail when name is too short', () => {
    const result = createPaymentMethodSchema.safeParse({ name: 'A' });
    expect(result.success).toBe(false);
  });

  it('should fail when name is missing', () => {
    const result = createPaymentMethodSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
