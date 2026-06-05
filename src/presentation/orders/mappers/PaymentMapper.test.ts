import Payment from '@/domain/orders/entities/Payment';
import PaymentMethod from '@/domain/orders/entities/PaymentMethod';
import PaymentMapper from './PaymentMapper';
import AddPaymentRequest from '../requests/AddPayment';

describe('PaymentMapper', () => {
  const createPayment = (): Payment =>
    new Payment({
      id: 'pay-1',
      orderId: 'order-1',
      amount: 100,
      method: new PaymentMethod({ id: 'method-1', name: 'Cash', companyId: 'comp-1' }),
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });

  describe('fromAddToDomain', () => {
    it('should map AddPaymentRequest to Payment', () => {
      const request: AddPaymentRequest = { amount: 50, methodId: 'method-1' };
      const payment = PaymentMapper.fromAddToDomain(request, 'order-1');
      expect(payment).toBeInstanceOf(Payment);
      expect(payment.amount.value).toBe(50);
      expect(payment.orderId.value).toBe('order-1');
    });
  });

  describe('toResponse', () => {
    it('should map Payment to PaymentResponse', () => {
      const payment = createPayment();
      const response = PaymentMapper.toResponse(payment);
      expect(response.id).toBe('pay-1');
      expect(response.orderId).toBe('order-1');
      expect(response.amount).toBe(100);
      expect(response.method.id).toBe('method-1');
      expect(response.method.name).toBe('Cash');
    });
  });
});
