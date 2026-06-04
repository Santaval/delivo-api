import OrderItemsManager from '@/application/orders/services/implementations/OrderItemsManager';
import IOrderRepository from '@/domain/orders/repositories/IOrderRepository';
import IOrderPricingCalculator from '@/domain/orders/services/IOrderPricingCalculator';
import { IProductRepository } from '@/domain/products/repositories/IProductRepository';
import ApplicationError from '@/application/core/errors/ApplicationError';
import { createOrder, createProduct, createOrderItem } from '@/tests/mocks/domain';

describe('OrderItemsManager', () => {
  let manager: OrderItemsManager;
  let mockOrdersRepo: jest.Mocked<IOrderRepository>;
  let mockProductsRepo: jest.Mocked<IProductRepository>;
  let mockPricingCalculator: jest.Mocked<IOrderPricingCalculator>;

  beforeEach(() => {
    mockOrdersRepo = {
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

    mockProductsRepo = {
      all: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCompanyId: jest.fn(),
      findByName: jest.fn(),
      findByPriceRange: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    mockPricingCalculator = {
      onAddItem: jest.fn(),
      onRemoveItem: jest.fn(),
    } as jest.Mocked<IOrderPricingCalculator>;

    manager = new OrderItemsManager(mockOrdersRepo, mockProductsRepo, mockPricingCalculator);
  });

  describe('addItem', () => {
    it('adds item to order and recalculates pricing', async () => {
      const order = createOrder({ items: [] });
      const product = createProduct({ id: 'product-1', grossPrice: 100, ivaRate: 13 });
      const orderItem = createOrderItem({ id: 'product-1', quantity: 2, billId: 'order-1' });
      const updatedOrder = createOrder({ items: [orderItem] });

      mockOrdersRepo.findById.mockResolvedValue(order);
      mockProductsRepo.find.mockResolvedValue(product);
      mockOrdersRepo.addItem.mockResolvedValue(order);
      mockPricingCalculator.onAddItem.mockResolvedValue(updatedOrder);
      mockOrdersRepo.update.mockResolvedValue(updatedOrder);

      const result = await manager.addItem('product-1', 2, 'order-1');

      expect(mockOrdersRepo.findById).toHaveBeenCalledWith('order-1');
      expect(mockProductsRepo.find).toHaveBeenCalledWith('product-1');
      expect(mockOrdersRepo.addItem).toHaveBeenCalled();
      expect(mockPricingCalculator.onAddItem).toHaveBeenCalled();
      expect(result).toBe(updatedOrder);
    });

    it('throws Error when order not found', async () => {
      mockOrdersRepo.findById.mockResolvedValue(null);

      await expect(manager.addItem('product-1', 2, 'non-existent')).rejects.toThrow('Order not found');
    });

    it('throws ApplicationError when product not found', async () => {
      const order = createOrder();
      mockOrdersRepo.findById.mockResolvedValue(order);
      mockProductsRepo.find.mockResolvedValue(null);

      await expect(manager.addItem('non-existent', 2, 'order-1')).rejects.toThrow(ApplicationError);
    });

    it('throws ApplicationError when order is in DELIVERED status', async () => {
      const order = createOrder({ deliveryStatus: 'DELIVERED' });
      mockOrdersRepo.findById.mockResolvedValue(order);
      mockProductsRepo.find.mockResolvedValue(createProduct());

      await expect(manager.addItem('product-1', 2, 'order-1')).rejects.toThrow(ApplicationError);
    });

    it('throws ApplicationError when order is in RETURNED status', async () => {
      const order = createOrder({ deliveryStatus: 'RETURNED' });
      mockOrdersRepo.findById.mockResolvedValue(order);
      mockProductsRepo.find.mockResolvedValue(createProduct());

      await expect(manager.addItem('product-1', 2, 'order-1')).rejects.toThrow(ApplicationError);
    });
  });

  describe('removeItem', () => {
    it('removes item from order and recalculates pricing', async () => {
      const order = createOrder();
      const orderItem = createOrderItem();
      const updatedOrder = createOrder({ items: [] });

      mockOrdersRepo.findById.mockResolvedValue(order);
      mockOrdersRepo.getItem.mockResolvedValue(orderItem);
      mockOrdersRepo.removeItem.mockResolvedValue(order);
      mockPricingCalculator.onRemoveItem.mockResolvedValue(updatedOrder);
      mockOrdersRepo.update.mockResolvedValue(updatedOrder);

      const result = await manager.removeItem('order-1', 'order-item-1');

      expect(mockOrdersRepo.findById).toHaveBeenCalledWith('order-1');
      expect(mockOrdersRepo.getItem).toHaveBeenCalledWith('order-item-1');
      expect(mockOrdersRepo.removeItem).toHaveBeenCalledWith('order-1', 'order-item-1');
      expect(mockPricingCalculator.onRemoveItem).toHaveBeenCalled();
      expect(result).toBe(updatedOrder);
    });

    it('throws Error when order not found', async () => {
      mockOrdersRepo.findById.mockResolvedValue(null);

      await expect(manager.removeItem('non-existent', 'item-1')).rejects.toThrow('Order not found');
    });

    it('throws ApplicationError when item not found', async () => {
      const order = createOrder();
      mockOrdersRepo.findById.mockResolvedValue(order);
      mockOrdersRepo.getItem.mockResolvedValue(null);

      await expect(manager.removeItem('order-1', 'non-existent')).rejects.toThrow(ApplicationError);
    });

    it('throws ApplicationError when order is in DELIVERED status', async () => {
      const order = createOrder({ deliveryStatus: 'DELIVERED' });
      mockOrdersRepo.findById.mockResolvedValue(order);

      await expect(manager.removeItem('order-1', 'item-1')).rejects.toThrow(ApplicationError);
    });

    it('throws ApplicationError when order is in RETURNED status', async () => {
      const order = createOrder({ deliveryStatus: 'RETURNED' });
      mockOrdersRepo.findById.mockResolvedValue(order);

      await expect(manager.removeItem('order-1', 'item-1')).rejects.toThrow(ApplicationError);
    });
  });
});