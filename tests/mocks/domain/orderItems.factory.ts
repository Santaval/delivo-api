import OrderItem from '@/domain/orders/entities/OrderItem';
import { ProductConstructorProps } from '@/domain/products/entities/Product';

export const createOrderItem = (overrides: Partial<ProductConstructorProps & { quantity?: number; billId?: string; itemId?: string }> = {}): OrderItem => {
  const props = {
    id: 'order-item-1',
    name: 'Test Order Item',
    grossPrice: 50,
    ivaRate: 13,
    companyId: 'company-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    quantity: 2,
    billId: 'bill-1',
    itemId: 'item-1',
    ...overrides,
  } as ProductConstructorProps & { quantity: number; billId: string; itemId: string };

  return new OrderItem(props);
};