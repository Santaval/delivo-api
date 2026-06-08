import PaymentMethod from '@/domain/orders/entities/PaymentMethod';
import PaymentMethodDtoMapper from './PaymentMethodMapper';
import CreatePaymentMethodRequest from '../requests/CreatePaymentMethod';

describe('PaymentMethodDtoMapper', () => {
  describe('toResponse', () => {
    it('should map PaymentMethod to PaymentMethodResponse', () => {
      const method = new PaymentMethod({
        id: 'method-1',
        name: 'Cash',
        companyId: 'comp-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const response = PaymentMethodDtoMapper.toResponse(method);
      expect(response.id).toBe('method-1');
      expect(response.name).toBe('Cash');
    });
  });

  describe('fromCreateToDomain', () => {
    it('should map CreatePaymentMethodRequest to PaymentMethod', () => {
      const request: CreatePaymentMethodRequest = { name: 'Card' };
      const method = PaymentMethodDtoMapper.fromCreateToDomain(request, 'comp-1');
      expect(method).toBeInstanceOf(PaymentMethod);
      expect(method.name).toBe('Card');
      expect(method.companyId).toBe('comp-1');
    });
  });
});
