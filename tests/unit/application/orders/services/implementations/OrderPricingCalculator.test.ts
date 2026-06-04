import OrderPricingCalculator from '@/application/orders/services/implementations/OrderPricingCalculator';
import IOrderRepository from '@/domain/orders/repositories/IOrderRepository';
import { IProductRepository } from '@/domain/products/repositories/IProductRepository';
import { createOrder, createProduct, createOrderItem } from '@/tests/mocks/domain';

describe('OrderPricingCalculator', () => {
  let calculator: OrderPricingCalculator;
  let mockOrdersRepository: jest.Mocked<IOrderRepository>;
  let mockProductsRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
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

    mockProductsRepository = {
      all: jest.fn(),
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCompanyId: jest.fn(),
      findByName: jest.fn(),
      findByPriceRange: jest.fn(),
    } as jest.Mocked<IProductRepository>;

    calculator = new OrderPricingCalculator(mockOrdersRepository, mockProductsRepository);
  });

  describe('onAddItem', () => {
    it('calculates correct subtotal and iva when adding item', async () => {
      const order = createOrder({ subtotal: 100, ivaTotal: 13, total: 113, paid: 0 });
      const product = createProduct({ id: 'product-1', grossPrice: 50, ivaRate: 13 });
      const item = createOrderItem({ id: 'product-1', quantity: 2, billId: 'order-1' });

      mockOrdersRepository.findById.mockResolvedValue(order);
      mockProductsRepository.find.mockResolvedValue(product);

      const result = await calculator.onAddItem(item);

      expect(mockOrdersRepository.findById).toHaveBeenCalledWith('order-1');
      expect(mockProductsRepository.find).toHaveBeenCalledWith('product-1');
      expect(order.subtotal).toBe(100 + (50 * 2 - (50 * 2 * 13 / 100)));
      expect(order.ivaTotal).toBe(13 + (50 * 2 * 13 / 100));
    });

    it('throws error when order not found', async () => {
      const item = createOrderItem();
      mockOrdersRepository.findById.mockResolvedValue(null);

      await expect(calculator.onAddItem(item)).rejects.toThrow('Order not found');
    });

    it('throws error when product not found', async () => {
      const order = createOrder();
      const item = createOrderItem();
      mockOrdersRepository.findById.mockResolvedValue(order);
      mockProductsRepository.find.mockResolvedValue(null);

      await expect(calculator.onAddItem(item)).rejects.toThrow('Product not found');
    });

    it('calculates correctly with 21% IVA', async () => {
      const order = createOrder({ subtotal: 0, ivaTotal: 0, total: 0, paid: 0 });
      const product = createProduct({ id: 'product-1', grossPrice: 100, ivaRate: 21 });
      const item = createOrderItem({ id: 'product-1', quantity: 1, billId: 'order-1' });

      mockOrdersRepository.findById.mockResolvedValue(order);
      mockProductsRepository.find.mockResolvedValue(product);

      await calculator.onAddItem(item);

      expect(order.subtotal).toBeCloseTo(79, 2);
      expect(order.ivaTotal).toBeCloseTo(21, 2);
    });
  });

  describe('onRemoveItem', () => {
    it('calculates correct subtotal and iva when removing item', async () => {
      const order = createOrder({ subtotal: 200, ivaTotal: 26, total: 226, paid: 0 });
      const product = createProduct({ id: 'product-1', grossPrice: 100, ivaRate: 13 });
      const item = createOrderItem({ id: 'product-1', quantity: 2, billId: 'order-1' });

      mockOrdersRepository.findById.mockResolvedValue(order);
      mockProductsRepository.find.mockResolvedValue(product);

      const result = await calculator.onRemoveItem(item);

      expect(mockOrdersRepository.findById).toHaveBeenCalledWith('order-1');
      expect(mockProductsRepository.find).toHaveBeenCalledWith('product-1');
    });

    it('throws error when order not found', async () => {
      const item = createOrderItem();
      mockOrdersRepository.findById.mockResolvedValue(null);

      await expect(calculator.onRemoveItem(item)).rejects.toThrow('Order not found');
    });

    it('throws error when product not found', async () => {
      const order = createOrder();
      const item = createOrderItem();
      mockOrdersRepository.findById.mockResolvedValue(order);
      mockProductsRepository.find.mockResolvedValue(null);

      await expect(calculator.onRemoveItem(item)).rejects.toThrow('Product not found');
    });
  });
});