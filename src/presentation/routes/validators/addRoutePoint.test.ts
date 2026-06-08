import addRoutePointSchema from './addRoutePoint';

describe('addRoutePointSchema', () => {
  it('should pass with valid orderId', () => {
    const result = addRoutePointSchema.safeParse({ orderId: 'order-123' });
    expect(result.success).toBe(true);
  });

  it('should fail when orderId is missing', () => {
    const result = addRoutePointSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
