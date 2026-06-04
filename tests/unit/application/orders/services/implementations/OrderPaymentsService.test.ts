import OrderPaymentsService from '@/application/orders/services/implementations/OrderPaymentsService';
import IPaymentRepository from '@/domain/orders/repositories/IPaymentRepository';
import IOrderRepository from '@/domain/orders/repositories/IOrderRepository';
import ApplicationError from '@/application/core/errors/ApplicationError';
import { createOrder, createPayment } from '@/tests/mocks/domain';

describe('OrderPaymentsService', () => {
  let service: OrderPaymentsService;
  let mockPaymentsRepository: jest.Mocked<IPaymentRepository>;
  let mockOrdersRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockPaymentsRepository = {
      add: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IPaymentRepository>;

    mockOrdersRepository = {
      findById: jest.fn(),
      findByCompany: jest.fn(),
      byCompanyAndManyDeliveryStatus: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      getItem: jest.fn(),
      byTimeRange: jest.fn(),
      byClientAndManyDeliveryStatus: jest.fn(),
    } as jest.Mocked<IOrderRepository>;

    service = new OrderPaymentsService(mockPaymentsRepository, mockOrdersRepository);
  });

  describe('add', () => {
    it('adds payment to order and updates paid amount', async () => {
      const order = createOrder({ total: 100, paid: 0, deliveryStatus: 'DELIVERED' });
      const payment = createPayment({ amount: 50, orderId: 'order-1' });
      const updatedOrder = createOrder({ total: 100, paid: 50, deliveryStatus: 'DELIVERED' });

      mockOrdersRepository.findById.mockResolvedValue(order);
      mockOrdersRepository.update.mockResolvedValue(updatedOrder);
      mockPaymentsRepository.add.mockResolvedValue(payment);

      const result = await service.add(payment);

      expect(mockOrdersRepository.findById).toHaveBeenCalledWith('order-1');
      expect(mockOrdersRepository.update).toHaveBeenCalled();
      expect(mockPaymentsRepository.add).toHaveBeenCalledWith(payment);
      expect(result).toBe(payment);
    });

    it('sets order status to PAID when paid >= total', async () => {
      const order = createOrder({ total: 100, paid: 0, deliveryStatus: 'DELIVERED' });
      const payment = createPayment({ amount: 100, orderId: 'order-1' });
      const updatedOrder = createOrder({ total: 100, paid: 100, status: 'PAID', deliveryStatus: 'DELIVERED' });

      mockOrdersRepository.findById.mockResolvedValue(order);
      mockOrdersRepository.update.mockResolvedValue(updatedOrder);
      mockPaymentsRepository.add.mockResolvedValue(payment);

      await service.add(payment);

      expect(mockOrdersRepository.update).toHaveBeenCalled();
    });

    it('throws ApplicationError when order not found', async () => {
      const payment = createPayment({ orderId: 'non-existent' });
      mockOrdersRepository.findById.mockResolvedValue(null);

      await expect(service.add(payment)).rejects.toThrow(ApplicationError);
    });

    it('throws ApplicationError when order is not DELIVERED', async () => {
      const order = createOrder({ deliveryStatus: 'PENDING' });
      const payment = createPayment();
      mockOrdersRepository.findById.mockResolvedValue(order);

      await expect(service.add(payment)).rejects.toThrow(ApplicationError);
    });

    it('throws ApplicationError when payment exceeds order total', async () => {
      const order = createOrder({ total: 100, paid: 0, deliveryStatus: 'DELIVERED' });
      const payment = createPayment({ amount: 150, orderId: 'order-1' });
      mockOrdersRepository.findById.mockResolvedValue(order);

      await expect(service.add(payment)).rejects.toThrow(ApplicationError);
    });
  });

  describe('delete', () => {
    it('throws ApplicationError as method not implemented', async () => {
      const paymentId = { value: 'payment-1' };

      await expect(service.delete(paymentId as any)).rejects.toThrow(ApplicationError);
    });
  });
});