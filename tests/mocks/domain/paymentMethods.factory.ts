import PaymentMethod from '@/domain/orders/entities/PaymentMethod';

type PaymentMethodConstructorProps = {
  id: string;
  name: string;
  companyId: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createPaymentMethod = (overrides: Partial<PaymentMethodConstructorProps> = {}): PaymentMethod => {
  const props: PaymentMethodConstructorProps = {
    id: 'payment-method-1',
    name: 'Cash',
    companyId: 'company-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
  return new PaymentMethod(props);
};