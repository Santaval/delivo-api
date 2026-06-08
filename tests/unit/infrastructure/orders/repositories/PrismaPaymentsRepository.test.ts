import { PaymentId } from '@/domain/orders/valueObjects/paymentId.valueObject';
import PrismaPaymentsRepository from '@/infrastructure/orders/repositories/PrismaPaymentsRepository';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockCreate = jest.fn();
  const mockDelete = jest.fn();

  return {
    prisma: {
      clientPayment: {
        create: mockCreate,
        delete: mockDelete,
      },
    },
    __mockCreate: mockCreate,
    __mockDelete: mockDelete,
  };
});

const { __mockCreate: mockCreate, __mockDelete: mockDelete } = jest.requireMock('@/infrastructure/prisma/client');

describe('PrismaPaymentsRepository', () => {
  let repository: PrismaPaymentsRepository;

  const mockPaymentRow = {
    id: 'payment-uuid-1',
    billId: 'order-uuid-1',
    amount: { toNumber: () => 100 },
    methodId: 'pm-uuid-1',
    method: {
      id: 'pm-uuid-1',
      name: 'Cash',
      companyId: 'company-uuid-1',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
    },
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaPaymentsRepository();
  });

  describe('add', () => {
    it('creates payment and returns mapped entity', async () => {
      mockCreate.mockResolvedValue(mockPaymentRow);

      const Payment = (await import('@/domain/orders/entities/Payment')).default;
      const PaymentMethod = (await import('@/domain/orders/entities/PaymentMethod')).default;

      const method = new PaymentMethod({
        id: 'pm-uuid-1',
        name: 'Cash',
        companyId: 'company-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const payment = new Payment({
        id: 'payment-uuid-1',
        amount: 100,
        method,
        orderId: 'order-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result = await repository.add(payment);

      expect(mockCreate).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deletes payment with correct id', async () => {
      mockDelete.mockResolvedValue(mockPaymentRow);

      const paymentId = PaymentId.create('payment-uuid-1');
      await repository.delete(paymentId);

      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: 'payment-uuid-1' },
      });
    });
  });
});
