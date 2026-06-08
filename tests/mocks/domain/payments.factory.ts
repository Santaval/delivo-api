import Payment from '@/domain/orders/entities/Payment';
import { createPaymentMethod } from './paymentMethods.factory';

type PaymentConstructorProps = {
  id: string;
  orderId: string;
  amount: number;
  method: ReturnType<typeof createPaymentMethod>;
  createdAt: string;
  updatedAt: string;
};

export const createPayment = (overrides: Partial<PaymentConstructorProps> = {}): Payment => {
  const props: PaymentConstructorProps = {
    id: 'payment-1',
    orderId: 'order-1',
    amount: 100,
    method: createPaymentMethod(),
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
  return new Payment(props);
};