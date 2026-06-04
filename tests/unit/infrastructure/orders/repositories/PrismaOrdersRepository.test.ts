import { CompanyId } from '@/domain/companies/valueObjects/companyId.valueObject';
import { ClientId } from '@/domain/clients/valueObjects/clientId.valueObject';
import { OrderDeliveryStatusType } from '@/domain/orders/valueObjects/orderDeliveryStatus';
import PrismaOrderRepository from '@/infrastructure/orders/repositories/PrismaOrdersRepository';
import InfrastructureError from '@/infrastructure/core/errors/InfrastructureError';
import DatabaseError from '@/infrastructure/core/errors/DatabaseError';

jest.mock('@/infrastructure/prisma/client', () => {
  const mockClientBillFindMany = jest.fn();
  const mockClientBillFindUnique = jest.fn();
  const mockClientBillCreate = jest.fn();
  const mockClientBillUpdate = jest.fn();
  const mockClientBillDelete = jest.fn();
  const mockClientBillItemFindUnique = jest.fn();
  const mockClientBillItemCreate = jest.fn();
  const mockClientBillItemDelete = jest.fn();

  return {
    prisma: {
      clientBill: {
        findMany: mockClientBillFindMany,
        findUnique: mockClientBillFindUnique,
        create: mockClientBillCreate,
        update: mockClientBillUpdate,
        delete: mockClientBillDelete,
      },
      clientBillItem: {
        findUnique: mockClientBillItemFindUnique,
        create: mockClientBillItemCreate,
        delete: mockClientBillItemDelete,
      },
    },
    __mockClientBillFindMany: mockClientBillFindMany,
    __mockClientBillFindUnique: mockClientBillFindUnique,
    __mockClientBillCreate: mockClientBillCreate,
    __mockClientBillUpdate: mockClientBillUpdate,
    __mockClientBillDelete: mockClientBillDelete,
    __mockClientBillItemFindUnique: mockClientBillItemFindUnique,
    __mockClientBillItemCreate: mockClientBillItemCreate,
    __mockClientBillItemDelete: mockClientBillItemDelete,
  };
});

const {
  __mockClientBillFindMany: mockClientBillFindMany,
  __mockClientBillFindUnique: mockClientBillFindUnique,
  __mockClientBillCreate: mockClientBillCreate,
  __mockClientBillUpdate: mockClientBillUpdate,
  __mockClientBillDelete: mockClientBillDelete,
  __mockClientBillItemFindUnique: mockClientBillItemFindUnique,
  __mockClientBillItemCreate: mockClientBillItemCreate,
  __mockClientBillItemDelete: mockClientBillItemDelete,
} = jest.requireMock('@/infrastructure/prisma/client');

describe('PrismaOrderRepository', () => {
  let repository: PrismaOrderRepository;

  const mockOrderRow = {
    id: 'order-uuid-1',
    companyId: 'company-uuid-1',
    number: 1,
    status: 'DRAFT',
    deliveryStatus: 'PENDING',
    subtotal: '100.00',
    ivaTotal: '13.00',
    total: '113.00',
    paid: '0.00',
    issueDate: new Date('2024-01-15T10:00:00Z'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T12:00:00Z'),
    client: {
      id: 'client-uuid-1',
      name: 'Test Client',
      companyId: 'company-uuid-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    items: [],
    payments: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaOrderRepository();
  });

  describe('findByCompany', () => {
    it('returns array of Order entities', async () => {
      mockClientBillFindMany.mockResolvedValue([mockOrderRow]);

      const result = await repository.findByCompany('company-uuid-1');

      expect(result).toHaveLength(1);
      expect(mockClientBillFindMany).toHaveBeenCalledWith({
        where: { companyId: 'company-uuid-1' },
        orderBy: { createdAt: 'desc' },
        include: repository.getIncludes(),
      });
    });

    it('throws Error on failure', async () => {
      mockClientBillFindMany.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findByCompany('company-uuid-1')).rejects.toThrow('Error fetching orders');
    });
  });

  describe('byCompanyAndManyDeliveryStatus', () => {
    it('filters by delivery statuses', async () => {
      mockClientBillFindMany.mockResolvedValue([mockOrderRow]);

      const statuses: OrderDeliveryStatusType[] = ['PENDING', 'IN_TRANSIT'];
      const result = await repository.byCompanyAndManyDeliveryStatus('company-uuid-1', statuses);

      expect(mockClientBillFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deliveryStatus: { in: statuses },
          }),
        })
      );
    });
  });

  describe('create', () => {
    it('creates order and returns mapped entity', async () => {
      mockClientBillCreate.mockResolvedValue(mockOrderRow);
      mockClientBillFindUnique.mockResolvedValue(mockOrderRow);

      const { Order } = await import('@/domain/orders');
      const { Client } = await import('@/domain/clients/entities/Client');

      const client = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        companyId: 'company-uuid-1',
        lat: null,
        lng: null,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const order = new Order({
        id: 'order-uuid-1',
        client,
        number: 1,
        subtotal: 100,
        ivaTotal: 13,
        total: 113,
        paid: 0,
        companyId: 'company-uuid-1',
        items: [],
        status: 'DRAFT',
        deliveryStatus: 'PENDING',
        payments: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result = await repository.create(order);

      expect(mockClientBillCreate).toHaveBeenCalled();
    });

    it('throws DatabaseError on failure', async () => {
      mockClientBillCreate.mockRejectedValue(new Error('DB Error'));

      const { Order } = await import('@/domain/orders');
      const { Client } = await import('@/domain/clients/entities/Client');

      const client = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        companyId: 'company-uuid-1',
        lat: null,
        lng: null,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const order = new Order({
        id: 'order-uuid-1',
        client,
        number: 1,
        subtotal: 100,
        ivaTotal: 13,
        total: 113,
        paid: 0,
        companyId: 'company-uuid-1',
        items: [],
        status: 'DRAFT',
        deliveryStatus: 'PENDING',
        payments: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      await expect(repository.create(order)).rejects.toThrow(DatabaseError);
    });
  });

  describe('findById', () => {
    it('returns Order when found', async () => {
      mockClientBillFindUnique.mockResolvedValue(mockOrderRow);

      const result = await repository.findById('order-uuid-1');

      expect(result).not.toBeNull();
      expect(mockClientBillFindUnique).toHaveBeenCalledWith({
        where: { id: 'order-uuid-1' },
        include: repository.getIncludes(),
      });
    });

    it('returns null when not found', async () => {
      mockClientBillFindUnique.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });

    it('throws Error on failure', async () => {
      mockClientBillFindUnique.mockRejectedValue(new Error('DB Error'));

      await expect(repository.findById('order-uuid-1')).rejects.toThrow('Error fetching order');
    });
  });

  describe('delete', () => {
    it('deletes order with correct id', async () => {
      mockClientBillDelete.mockResolvedValue(mockOrderRow);

      await repository.delete('order-uuid-1');

      expect(mockClientBillDelete).toHaveBeenCalledWith({
        where: { id: 'order-uuid-1' },
      });
    });

    it('throws Error on failure', async () => {
      mockClientBillDelete.mockRejectedValue(new Error('DB Error'));

      await expect(repository.delete('order-uuid-1')).rejects.toThrow('Error deleting order');
    });
  });

  describe('update', () => {
    it('updates order and returns mapped entity', async () => {
      mockClientBillUpdate.mockResolvedValue(mockOrderRow);

      const { Order } = await import('@/domain/orders');
      const { Client } = await import('@/domain/clients/entities/Client');

      const client = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        companyId: 'company-uuid-1',
        lat: null,
        lng: null,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const order = new Order({
        id: 'order-uuid-1',
        client,
        number: 1,
        subtotal: 100,
        ivaTotal: 13,
        total: 113,
        paid: 50,
        companyId: 'company-uuid-1',
        items: [],
        status: 'CONFIRMED',
        deliveryStatus: 'PENDING',
        payments: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const result = await repository.update(order);

      expect(mockClientBillUpdate).toHaveBeenCalled();
    });

    it('throws Error on failure', async () => {
      mockClientBillUpdate.mockRejectedValue(new Error('DB Error'));

      const { Order } = await import('@/domain/orders');
      const { Client } = await import('@/domain/clients/entities/Client');

      const client = new Client({
        id: 'client-uuid-1',
        name: 'Test Client',
        companyId: 'company-uuid-1',
        lat: null,
        lng: null,
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      const order = new Order({
        id: 'order-uuid-1',
        client,
        number: 1,
        subtotal: 100,
        ivaTotal: 13,
        total: 113,
        paid: 0,
        companyId: 'company-uuid-1',
        items: [],
        status: 'DRAFT',
        deliveryStatus: 'PENDING',
        payments: [],
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: '2024-01-15T12:00:00.000Z',
      });

      await expect(repository.update(order)).rejects.toThrow('Error updating order');
    });
  });

  describe('getItem', () => {
    it('returns OrderItem when found', async () => {
      const mockItemRow = {
        id: 'item-uuid-1',
        billId: 'order-uuid-1',
        productId: 'product-uuid-1',
        quantity: '2',
        unitGrossPrice: '50.00',
        ivaRate: '0.13',
        createdAt: new Date(),
        updatedAt: new Date(),
        product: {
          id: 'product-uuid-1',
          name: 'Test Product',
          ivaRate: '0.13',
          grossPrice: '50.00',
          companyId: 'company-uuid-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      };

      mockClientBillItemFindUnique.mockResolvedValue(mockItemRow);

      const result = await repository.getItem('item-uuid-1');

      expect(result).not.toBeNull();
      expect(mockClientBillItemFindUnique).toHaveBeenCalledWith({
        where: { id: 'item-uuid-1' },
        include: { product: true },
      });
    });

    it('returns null when not found', async () => {
      mockClientBillItemFindUnique.mockResolvedValue(null);

      const result = await repository.getItem('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('byTimeRange', () => {
    it('filters by date range', async () => {
      mockClientBillFindMany.mockResolvedValue([mockOrderRow]);

      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      const companyId = new CompanyId('company-uuid-1');

      await repository.byTimeRange(start, end, companyId);

      expect(mockClientBillFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: { gte: start, lte: end },
          }),
        })
      );
    });
  });

  describe('byClientAndManyDeliveryStatus', () => {
    it('filters by client and delivery statuses', async () => {
      mockClientBillFindMany.mockResolvedValue([mockOrderRow]);

      const clientId = new ClientId('client-uuid-1');
      const statuses: OrderDeliveryStatusType[] = ['PENDING'];

      await repository.byClientAndManyDeliveryStatus(clientId, statuses);

      expect(mockClientBillFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            clientId: 'client-uuid-1',
            deliveryStatus: { in: statuses },
          }),
        })
      );
    });
  });
});
