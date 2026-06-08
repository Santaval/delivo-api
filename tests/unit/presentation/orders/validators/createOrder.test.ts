import createOrderSchema from '@/presentation/orders/validators/createOrder';

describe('createOrderSchema', () => {
  it('should pass with valid clientId', () => {
    const result = createOrderSchema.safeParse({ clientId: 'client-123' });
    expect(result.success).toBe(true);
  });

  it('should fail when clientId is missing', () => {
    const result = createOrderSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
