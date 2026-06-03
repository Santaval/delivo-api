import Order from '@/domain/orders/entities/Order';
import { ConstructorProps } from '@/domain/orders/entities/Order';
import { createClient } from './clients.factory';
import { createOrderItem } from './orderItems.factory';
import { createPayment } from './payments.factory';

export const createOrder = (overrides: Partial<ConstructorProps> = {}): Order => {
  const props: ConstructorProps = {
    id: 'order-1',
    client: createClient(),
    number: 1001,
    subtotal: 100,
    ivaTotal: 13,
    total: 113,
    paid: 0,
    companyId: 'company-1',
    items: [createOrderItem()],
    status: 'PENDING',
    deliveryStatus: 'PENDING',
    payments: [createPayment()],
    ...overrides,
  } as ConstructorProps;
  return new Order(props);
};