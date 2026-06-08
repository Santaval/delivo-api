import { OrderItem } from '@/domain/orders';
import OrderItemMapper from '@/presentation/orders/mappers/OrderItemMapper';
import AddOrderItemRequest from '@/presentation/orders/requests/AddOrderItem';

describe('OrderItemMapper', () => {
  const createOrderItem = (): OrderItem =>
    new OrderItem({
      id: 'prod-1',
      name: 'Product A',
      grossPrice: 100,
      ivaRate: 13,
      companyId: 'comp-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      quantity: 2,
      billId: 'order-1',
      itemId: 'item-1',
    });

  describe('toResponse', () => {
    it('should map OrderItem to OrderItemResponse', () => {
      const item = createOrderItem();
      const response = OrderItemMapper.toResponse(item);
      expect(response.id).toBe('item-1');
      expect(response.name).toBe('Product A');
      expect(response.quantity).toBe(2);
      expect(response.productId).toBe('prod-1');
    });
  });

  describe('fromAddItemRequest', () => {
    it('should map AddOrderItemRequest to OrderItem', () => {
      const request: AddOrderItemRequest = { productId: 'prod-1', quantity: 3 };
      const item = OrderItemMapper.fromAddItemRequest(request, 'order-1');
      expect(item).toBeInstanceOf(OrderItem);
      expect(item.quantity).toBe(3);
      expect(item.billId).toBe('order-1');
    });
  });
});
