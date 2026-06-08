import addPaymentSchema from '@/presentation/orders/validators/addPayment';

describe('addPaymentSchema', () => {
  it('should pass with valid data', () => {
    const result = addPaymentSchema.safeParse({ amount: 100, methodId: 'method-1' });
    expect(result.success).toBe(true);
  });

  it('should fail when amount is negative', () => {
    const result = addPaymentSchema.safeParse({ amount: -1, methodId: 'method-1' });
    expect(result.success).toBe(false);
  });

  it('should fail when methodId is empty', () => {
    const result = addPaymentSchema.safeParse({ amount: 100, methodId: '' });
    expect(result.success).toBe(false);
  });
});
