import { Request, Response } from 'express';
import OrdersController from './Orders.controller';
import { IOrdersService } from '@/application/orders/services/interfaces/IOrdersService';
import IOrderPaymentsService from '@/application/orders/services/interfaces/IOrderPaymentsService';
import IOrderItemsManager from '@/application/orders/services/interfaces/IOrderItemsManager';
import { Order } from '@/domain/orders';
import { Client } from '@/domain/clients/entities/Client';
import Payment from '@/domain/orders/entities/Payment';
import PaymentMethod from '@/domain/orders/entities/PaymentMethod';

describe('OrdersController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const createOrder = (): Order => {
    const client = new Client({
      id: 'client-1',
      name: 'Juan',
      companyId: 'comp-1',
      lat: 10,
      lng: -66,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return new Order({
      id: 'order-1',
      client,
      number: 1,
      subtotal: 100,
      ivaTotal: 13,
      total: 113,
      paid: 0,
      companyId: 'comp-1',
      items: [],
      status: 'PENDING',
      deliveryStatus: 'PENDING',
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  let ordersService: jest.Mocked<IOrdersService>;
  let orderPaymentsService: jest.Mocked<IOrderPaymentsService>;
  let orderItemsManager: jest.Mocked<IOrderItemsManager>;
  let controller: OrdersController;

  beforeEach(() => {
    ordersService = {
      openedByCompany: jest.fn(),
      closedByCompany: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      markAsDelivered: jest.fn(),
      byClient: jest.fn(),
      byClientBilled: jest.fn(),
    } as any;
    orderPaymentsService = { add: jest.fn() } as any;
    orderItemsManager = { addItem: jest.fn(), removeItem: jest.fn() } as any;
    controller = new OrdersController(ordersService, orderPaymentsService, orderItemsManager);
  });

  describe('ordersByCompany', () => {
    it('should return orders for company', async () => {
      ordersService.openedByCompany.mockResolvedValue([createOrder()]);
      const req = { headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.ordersByCompany(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('billsByCompany', () => {
    it('should return billed orders for company', async () => {
      ordersService.closedByCompany.mockResolvedValue([createOrder()]);
      const req = { headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.billsByCompany(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('create', () => {
    it('should create order and return 201', async () => {
      ordersService.create.mockResolvedValue(createOrder());
      const req = { body: { clientId: 'client-1' }, headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'order-1' }));
    });
  });

  describe('findById', () => {
    it('should return order when found', async () => {
      ordersService.findById.mockResolvedValue(createOrder());
      const req = { params: { id: 'order-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'order-1' }));
    });

    it('should return 404 when not found', async () => {
      ordersService.findById.mockResolvedValue(null as any);
      const req = { params: { id: 'order-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('addItem', () => {
    it('should add item and return order', async () => {
      orderItemsManager.addItem.mockResolvedValue(createOrder());
      const req = { params: { id: 'order-1' }, body: { productId: 'prod-1', quantity: 2 } } as unknown as Request;
      const res = mockRes();
      await controller.addItem(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('markAsDelivered', () => {
    it('should mark order as delivered', async () => {
      ordersService.markAsDelivered.mockResolvedValue(createOrder());
      const req = { params: { id: 'order-1' } } as unknown as Request;
      const res = mockRes();
      await controller.markAsDelivered(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('removeItem', () => {
    it('should remove item and return order', async () => {
      orderItemsManager.removeItem.mockResolvedValue(createOrder());
      const req = { params: { id: 'order-1', itemId: 'item-1' } } as unknown as Request;
      const res = mockRes();
      await controller.removeItem(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('byClient', () => {
    it('should return orders by client', async () => {
      ordersService.byClient.mockResolvedValue([createOrder()]);
      const req = { params: { clientId: 'client-1' } } as unknown as Request;
      const res = mockRes();
      await controller.byClient(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('byClientBilled', () => {
    it('should return billed orders by client', async () => {
      ordersService.byClientBilled.mockResolvedValue([createOrder()]);
      const req = { params: { clientId: 'client-1' } } as unknown as Request;
      const res = mockRes();
      await controller.byClientBilled(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('addPayment', () => {
    it('should add payment and return 201', async () => {
      const payment = new Payment({
        id: 'pay-1',
        orderId: 'order-1',
        amount: 50,
        method: new PaymentMethod({ id: 'method-1', name: 'Cash', companyId: 'comp-1' }),
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
      orderPaymentsService.add.mockResolvedValue(payment);
      const req = { params: { id: 'order-1' }, body: { amount: 50, methodId: 'method-1' } } as unknown as Request;
      const res = mockRes();
      await controller.addPayment(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
