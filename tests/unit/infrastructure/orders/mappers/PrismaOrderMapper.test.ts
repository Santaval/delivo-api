import { Client as PrismaClientModel, ClientBill, ClientBillItem, ClientPayment, PaymentMethod as PrismaPaymentMethod, Prisma } from '@/infrastructure/prisma/generated/prisma/client';
import { FullPaymentType } from '@/infrastructure/orders/mappers/PrismaPaymentMapper';
import { ClientBillCreateArgs, ClientBillUpdateArgs } from '@/infrastructure/prisma/generated/prisma/models';
import PrismaOrderMapper from '@/infrastructure/orders/mappers/PrismaOrderMapper';
import { Order } from '@/domain/orders';
import { Company } from '@/domain/companies/entities/Company';
import { Client } from '@/domain/clients/entities/Client';
import PaymentMethod from '@/domain/orders/entities/PaymentMethod';
import Payment from '@/domain/orders/entities/Payment';
import OrderItem from '@/domain/orders/entities/OrderItem';

describe('PrismaOrderMapper', () => {
  const createDecimal = (value: string): Prisma.Decimal => new Prisma.Decimal(value);

  const mockCompany = new Company({
    id: 'company-uuid-1',
    name: 'Test Company',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockClient = new Client({
    id: 'client-uuid-1',
    name: 'Test Client',
    companyId: 'company-uuid-1',
    lat: null,
    lng: null,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockPaymentMethod = new PaymentMethod({
    id: 'pm-uuid-1',
    name: 'Cash',
    companyId: 'company-uuid-1',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockPayment = new Payment({
    id: 'payment-uuid-1',
    amount: 100,
    method: mockPaymentMethod,
    orderId: 'order-uuid-1',
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
  });

  const mockOrderItem = new OrderItem({
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

  const mockPrismaClient: PrismaClientModel = {
    id: 'client-uuid-1',
    name: 'Test Client',
    companyId: 'company-uuid-1',
    phoneNumber: null,
    email: null,
    lat: null,
    lng: null,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    deletedAt: null,
  };

  const mockPrismaOrder: ClientBill & { items: ClientBillItem[]; client: PrismaClientModel; payments: FullPaymentType[] } = {
    id: 'order-uuid-1',
    clientId: 'client-uuid-1',
    companyId: 'company-uuid-1',
    number: 1,
    status: 'PENDING',
    deliveryStatus: 'PENDING',
    subtotal: createDecimal('100.00'),
    ivaTotal: createDecimal('13.00'),
    total: createDecimal('113.00'),
    paid: createDecimal('0.00'),
    issueDate: new Date('2024-01-15T10:00:00Z'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    client: mockPrismaClient,
    items: [],
    payments: [],
  };

  describe('toDomain', () => {
    it('maps all fields correctly', () => {
      const order = PrismaOrderMapper.toDomain(mockPrismaOrder);

      expect(order).toBeInstanceOf(Order);
      expect(order.id).toBe(mockPrismaOrder.id);
      expect(order.companyId).toBe(mockPrismaOrder.companyId);
      expect(order.number).toBe(mockPrismaOrder.number);
    });

    it('converts Decimal fields to numbers', () => {
      const order = PrismaOrderMapper.toDomain(mockPrismaOrder);

      expect(order.subtotal).toBe(100);
      expect(order.ivaTotal).toBe(13);
      expect(order.total).toBe(113);
    });

    it('maps client correctly', () => {
      const order = PrismaOrderMapper.toDomain(mockPrismaOrder);

      expect(order.client).toBeInstanceOf(Client);
      expect(order.client.id.value).toBe(mockPrismaClient.id);
    });
  });

  describe('toPrisma', () => {
    it('returns correct ClientBillCreateArgs', () => {
      const domainOrder = new Order({
        id: 'order-uuid-1',
        client: mockClient,
        number: 1,
        subtotal: 100,
        ivaTotal: 13,
        total: 113,
        paid: 0,
        companyId: 'company-uuid-1',
        items: [],
        status: 'PENDING',
        deliveryStatus: 'PENDING',
        payments: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ClientBillCreateArgs = PrismaOrderMapper.toPrisma(domainOrder);

      expect(result.data).toMatchObject({
        clientId: 'client-uuid-1',
        companyId: 'company-uuid-1',
        subtotal: 100,
        ivaTotal: 13,
        status: 'PENDING',
        deliveryStatus: 'PENDING',
      });
      expect(result.include).toBeDefined();
    });

    it('sets total equal to subtotal (current bug behavior)', () => {
      const domainOrder = new Order({
        id: 'order-uuid-1',
        client: mockClient,
        number: 1,
        subtotal: 100,
        ivaTotal: 13,
        total: 113,
        paid: 0,
        companyId: 'company-uuid-1',
        items: [],
        status: 'PENDING',
        deliveryStatus: 'PENDING',
        payments: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result: ClientBillCreateArgs = PrismaOrderMapper.toPrisma(domainOrder);

      expect(result.data.total).toBe(100);
    });
  });

  describe('toPrismaUpdate', () => {
    it('returns correct ClientBillUpdateArgs with where clause', () => {
      const domainOrder = new Order({
        id: 'order-uuid-1',
        client: mockClient,
        number: 1,
        subtotal: 100,
        ivaTotal: 13,
        total: 113,
        paid: 50,
        companyId: 'company-uuid-1',
        items: [],
        status: 'PAID',
        deliveryStatus: 'PENDING',
        payments: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T14:00:00.000Z',
      });

      const result: ClientBillUpdateArgs = PrismaOrderMapper.toPrismaUpdate(domainOrder);

      expect(result.where).toEqual({ id: 'order-uuid-1' });
      expect(result.data).toMatchObject({
        status: 'PAID',
        paid: 50,
      });
    });
  });
});
