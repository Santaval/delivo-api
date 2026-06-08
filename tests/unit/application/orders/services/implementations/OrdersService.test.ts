import OrdersService from '@/application/orders/services/implementations/OrdersService';
import { IOrdersService } from '@/application/orders/services/interfaces/IOrdersService';
import IOrderRepository from '@/domain/orders/repositories/IOrderRepository';
import ApplicationError from '@/application/core/errors/ApplicationError';
import { createOrder } from '@/tests/mocks/domain';
import { ClientId } from '@/domain/clients/valueObjects/clientId.valueObject';

describe('OrdersService', () => {
  let service: IOrdersService;
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
    service = new OrdersService(mockRepository);
  });

  describe('findByCompany', () => {
    it('returns orders for company', async () => {
      const orders = [createOrder(), createOrder({ id: 'order-2' })];
      mockRepository.findByCompany.mockResolvedValue(orders);

      const result = await service.findByCompany('company-1');

      expect(mockRepository.findByCompany).toHaveBeenCalledWith('company-1');
      expect(result).toHaveLength(2);
    });
  });

  describe('closedByCompany', () => {
    it('returns delivered orders for company', async () => {
      const orders = [createOrder({ id: 'order-1', deliveryStatus: 'DELIVERED' })];
      mockRepository.byCompanyAndManyDeliveryStatus.mockResolvedValue(orders);

      const result = await service.closedByCompany('company-1');

      expect(mockRepository.byCompanyAndManyDeliveryStatus).toHaveBeenCalledWith('company-1', ['DELIVERED']);
      expect(result).toHaveLength(1);
    });
  });

  describe('openedByCompany', () => {
    it('returns pending/in_transit/on_route orders for company', async () => {
      const orders = [createOrder({ id: 'order-1', deliveryStatus: 'PENDING' })];
      mockRepository.byCompanyAndManyDeliveryStatus.mockResolvedValue(orders);

      const result = await service.openedByCompany('company-1');

      expect(mockRepository.byCompanyAndManyDeliveryStatus).toHaveBeenCalledWith('company-1', ['PENDING', 'ON_ROUTE', 'IN_TRANSIT']);
      expect(result).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('creates and returns order', async () => {
      const order = createOrder();
      mockRepository.create.mockResolvedValue(order);

      const result = await service.create(order);

      expect(mockRepository.create).toHaveBeenCalledWith(order);
      expect(result).toBe(order);
    });
  });

  describe('findById', () => {
    it('returns order by id', async () => {
      const order = createOrder();
      mockRepository.findById.mockResolvedValue(order);

      const result = await service.findById('order-1');

      expect(mockRepository.findById).toHaveBeenCalledWith('order-1');
      expect(result).toBe(order);
    });

    it('returns null when order not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('deletes order', async () => {
      mockRepository.delete.mockResolvedValue();

      await service.delete('order-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('order-1');
    });
  });

  describe('update', () => {
    it('updates and returns order', async () => {
      const order = createOrder({ total: 200 });
      mockRepository.update.mockResolvedValue(order);

      const result = await service.update(order);

      expect(mockRepository.update).toHaveBeenCalledWith(order);
      expect(result).toBe(order);
    });
  });

  describe('markAsDelivered', () => {
    it('sets delivery status to DELIVERED and returns order', async () => {
      const order = createOrder();
      mockRepository.findById.mockResolvedValue(order);
      mockRepository.update.mockResolvedValue({ ...order, deliveryStatus: 'DELIVERED' } as ReturnType<typeof createOrder>);

      const result = await service.markAsDelivered('order-1');

      expect(mockRepository.findById).toHaveBeenCalledWith('order-1');
      expect(mockRepository.update).toHaveBeenCalled();
    });

    it('throws ApplicationError when order not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.markAsDelivered('non-existent')).rejects.toThrow(ApplicationError);
    });
  });

  describe('byClient', () => {
    it('returns open orders for client', async () => {
      const orders = [createOrder()];
      mockRepository.byClientAndManyDeliveryStatus.mockResolvedValue(orders);
      const clientId = { value: 'client-1' } as ClientId;

      const result = await service.byClient(clientId);

      expect(mockRepository.byClientAndManyDeliveryStatus).toHaveBeenCalledWith(clientId, ['PENDING', 'ON_ROUTE', 'IN_TRANSIT']);
      expect(result).toHaveLength(1);
    });
  });

  describe('byClientBilled', () => {
    it('returns closed (delivered) orders for client', async () => {
      const orders = [createOrder({ deliveryStatus: 'DELIVERED' })];
      mockRepository.byClientAndManyDeliveryStatus.mockResolvedValue(orders);
      const clientId = { value: 'client-1' } as ClientId;

      const result = await service.byClientBilled(clientId);

      expect(mockRepository.byClientAndManyDeliveryStatus).toHaveBeenCalledWith(clientId, ['DELIVERED']);
      expect(result).toHaveLength(1);
    });
  });
});