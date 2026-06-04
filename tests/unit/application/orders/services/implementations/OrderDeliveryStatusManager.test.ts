import OrderDeliveryStatusManager from '@/application/orders/services/implementations/OrderDeliveryStatusManger';
import IOrderRepository from '@/domain/orders/repositories/IOrderRepository';
import ApplicationError from '@/application/core/errors/ApplicationError';
import { createOrder } from '@/tests/mocks/domain';

describe('OrderDeliveryStatusManager', () => {
  let manager: OrderDeliveryStatusManager;
  let mockRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockRepository = {
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
    manager = new OrderDeliveryStatusManager(mockRepository);
  });

  describe('change', () => {
    const validStatuses = ['PENDING', 'ON_ROUTE', 'IN_TRANSIT', 'DELIVERED', 'RETURNED'] as const;

    it('changes order delivery status to PENDING', async () => {
      const order = createOrder({ deliveryStatus: 'ON_ROUTE' });
      mockRepository.findById.mockResolvedValue(order);
      mockRepository.update.mockResolvedValue({ ...order, deliveryStatus: 'PENDING' } as ReturnType<typeof createOrder>);

      const result = await manager.change('order-1', 'PENDING');

      expect(mockRepository.findById).toHaveBeenCalledWith('order-1');
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('changes order delivery status to ON_ROUTE', async () => {
      const order = createOrder({ deliveryStatus: 'PENDING' });
      mockRepository.findById.mockResolvedValue(order);
      mockRepository.update.mockResolvedValue({ ...order, deliveryStatus: 'ON_ROUTE' } as ReturnType<typeof createOrder>);

      const result = await manager.change('order-1', 'ON_ROUTE');

      expect(result).toBeDefined();
    });

    it('changes order delivery status to IN_TRANSIT', async () => {
      const order = createOrder({ deliveryStatus: 'ON_ROUTE' });
      mockRepository.findById.mockResolvedValue(order);
      mockRepository.update.mockResolvedValue({ ...order, deliveryStatus: 'IN_TRANSIT' } as ReturnType<typeof createOrder>);

      const result = await manager.change('order-1', 'IN_TRANSIT');

      expect(result).toBeDefined();
    });

    it('changes order delivery status to DELIVERED', async () => {
      const order = createOrder({ deliveryStatus: 'IN_TRANSIT' });
      mockRepository.findById.mockResolvedValue(order);
      mockRepository.update.mockResolvedValue({ ...order, deliveryStatus: 'DELIVERED' } as ReturnType<typeof createOrder>);

      const result = await manager.change('order-1', 'DELIVERED');

      expect(result).toBeDefined();
    });

    it('changes order delivery status to RETURNED', async () => {
      const order = createOrder({ deliveryStatus: 'DELIVERED' });
      mockRepository.findById.mockResolvedValue(order);
      mockRepository.update.mockResolvedValue({ ...order, deliveryStatus: 'RETURNED' } as ReturnType<typeof createOrder>);

      const result = await manager.change('order-1', 'RETURNED');

      expect(result).toBeDefined();
    });

    it('throws ApplicationError when order not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(manager.change('non-existent', 'PENDING')).rejects.toThrow(ApplicationError);
    });
  });
});