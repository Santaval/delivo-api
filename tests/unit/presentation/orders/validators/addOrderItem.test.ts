import addOrderItemSchema from '@/presentation/orders/validators/addOrderItem';

describe('addOrderItemSchema', () => {
  it('should pass with valid data', () => {
    const result = addOrderItemSchema.safeParse({ productId: 'prod-1', quantity: 5 });
    expect(result.success).toBe(true);
  });

  it('should fail when productId is missing', () => {
    const result = addOrderItemSchema.safeParse({ quantity: 5 });
    expect(result.success).toBe(false);
  });

  it('should fail when quantity is zero', () => {
    const result = addOrderItemSchema.safeParse({ productId: 'prod-1', quantity: 0 });
    expect(result.success).toBe(false);
  });
});
