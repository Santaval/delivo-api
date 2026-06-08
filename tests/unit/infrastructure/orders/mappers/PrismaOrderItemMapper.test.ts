import { ClientBillItem, Product, Prisma } from '@/infrastructure/prisma/generated/prisma/client';
import { ClientBillItemCreateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import PrismaOrderItemMapper from '@/infrastructure/orders/mappers/PrismaOrderItemMapper';
import OrderItem from '@/domain/orders/entities/OrderItem';

describe('PrismaOrderItemMapper', () => {
  const createDecimal = (value: string): Prisma.Decimal => new Prisma.Decimal(value);

  const mockPrismaItem: ClientBillItem & { product: Product } = {
    id: 'item-uuid-1',
    billId: 'order-uuid-1',
    productId: 'product-uuid-1',
    quantity: createDecimal('2'),
    unitGrossPrice: createDecimal('50.00'),
    ivaRate: createDecimal('0.13'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    product: {
      id: 'product-uuid-1',
      name: 'Test Product',
      ivaRate: createDecimal('0.13'),
      grossPrice: createDecimal('50.00'),
      companyId: 'company-uuid-1',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T12:00:00Z'),
      deletedAt: null,
    },
  };

  describe('toDomain', () => {
    it('maps all fields correctly', () => {
      const item = PrismaOrderItemMapper.toDomain(mockPrismaItem);

      expect(item).toBeInstanceOf(OrderItem);
      expect(item.id).toBe(mockPrismaItem.productId);
      expect(item.billId).toBe(mockPrismaItem.billId);
      expect(item.quantity).toBe(2);
    });

    it('converts Decimal fields to numbers', () => {
      const item = PrismaOrderItemMapper.toDomain(mockPrismaItem);

      expect(item.pricing.grossPrice).toBe(50);
      expect(item.pricing.ivaRate).toBe(0.13);
    });

    it('handles null deletedAt on product', () => {
      const item = PrismaOrderItemMapper.toDomain(mockPrismaItem);

      expect(item.deletedAt).toBeNull();
    });

    it('maps itemId correctly', () => {
      const item = PrismaOrderItemMapper.toDomain(mockPrismaItem);

      expect(item.itemId).toBe(mockPrismaItem.id);
    });
  });

  describe('toPrisma', () => {
    it('returns correct ClientBillItemCreateArgs', () => {
      const domainItem = new OrderItem({
        id: 'product-uuid-1',
        billId: 'order-uuid-1',
        quantity: 2,
        grossPrice: 50,
        ivaRate: 0.13,
        name: 'Test Product',
        companyId: 'company-uuid-1',
        itemId: 'item-uuid-1',
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ClientBillItemCreateArgs = PrismaOrderItemMapper.toPrisma(domainItem);

      expect(result.data).toMatchObject({
        productId: 'product-uuid-1',
        billId: 'order-uuid-1',
        quantity: 2,
      });
    });
  });
});
