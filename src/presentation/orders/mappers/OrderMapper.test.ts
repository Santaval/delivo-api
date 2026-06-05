import { Order } from '@/domain/orders';
import { Client } from '@/domain/clients/entities/Client';
import OrdersDtoMapper from './OrderMapper';
import CreateOrderRequest from '../requests/CreateOrderRequest';

describe('OrdersDtoMapper', () => {
  const createOrder = (): Order => {
    const client = new Client({
      id: 'client-1',
      name: 'Juan',
      companyId: 'comp-1',
      lat: 10,
      lng: -66,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return new Order({
      id: 'order-1',
      client,
      number: 1,
      subtotal: 100,
      ivaTotal: 13,
      total: 113,
      paid: 0,
      companyId: 'comp-1',
      items: [],
      status: 'PENDING',
      deliveryStatus: 'PENDING',
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  describe('toResponse', () => {
    it('should map Order to OrderResponse', () => {
      const order = createOrder();
      const response = OrdersDtoMapper.toResponse(order);
      expect(response.id).toBe('order-1');
      expect(response.client.id).toBe('client-1');
      expect(response.pricing.subtotal).toBe(100);
      expect(response.pricing.ivaTotal).toBe(13);
      expect(response.pricing.total).toBe(113);
      expect(response.status).toBe('PENDING');
      expect(response.deliveryStatus).toBe('PENDING');
    });
  });

  describe('fromCreateToDomain', () => {
    it('should map CreateOrderRequest to Order', () => {
      const request: CreateOrderRequest = { clientId: 'client-1' };
      const order = OrdersDtoMapper.fromCreateToDomain(request, 'comp-1');
      expect(order).toBeInstanceOf(Order);
      expect(order.companyId).toBe('comp-1');
      expect(order.client.id.value).toBe('client-1');
      expect(order.deliveryStatus).toBe('PENDING');
    });
  });
});
