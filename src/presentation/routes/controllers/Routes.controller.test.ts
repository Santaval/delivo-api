import { Request, Response } from 'express';
import RoutesContoller from './Routes.controller';
import IRouteService from '@/application/routes/services/interfaces/IRouteService';
import { Route } from '@/domain/routes';
import { RoutePoint } from '@/domain/routes';
import { Order } from '@/domain/orders';
import { Client } from '@/domain/clients/entities/Client';

describe('RoutesContoller', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const createRoute = (): Route => {
    const client = new Client({
      id: 'client-1',
      name: 'Juan',
      companyId: 'comp-1',
      lat: 10,
      lng: -66,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const order = new Order({
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
    const point = new RoutePoint({
      id: 'point-1',
      status: 'CREATED',
      index: 0,
      order,
      polyline: null,
      routeId: 'route-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return new Route({
      id: 'route-1',
      name: 'Ruta Norte',
      status: 'CREATED',
      companyId: 'comp-1',
      polyline: null,
      points: [point],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  let routeService: jest.Mocked<IRouteService>;
  let controller: RoutesContoller;

  beforeEach(() => {
    routeService = {
      create: jest.fn(),
      findAllByCompany: jest.fn(),
      findById: jest.fn(),
      addPoint: jest.fn(),
      removePoint: jest.fn(),
      start: jest.fn(),
      completeDelivery: jest.fn(),
    } as any;
    controller = new RoutesContoller(routeService);
  });

  describe('create', () => {
    it('should create route and return 201', async () => {
      routeService.create.mockResolvedValue(createRoute());
      const req = { body: { name: 'Ruta Sur' }, headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('findAll', () => {
    it('should return routes for company', async () => {
      routeService.findAllByCompany.mockResolvedValue([createRoute()]);
      const req = { headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findAll(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('findById', () => {
    it('should return route when found', async () => {
      routeService.findById.mockResolvedValue(createRoute());
      const req = { params: { id: 'route-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 when not found', async () => {
      routeService.findById.mockResolvedValue(null as any);
      const req = { params: { id: 'route-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('addPoint', () => {
    it('should add point and return 201', async () => {
      routeService.addPoint.mockResolvedValue(createRoute().points[0]);
      const req = { params: { id: 'route-1' }, body: { orderId: 'order-1' } } as unknown as Request;
      const res = mockRes();
      await controller.addPoint(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('removePoint', () => {
    it('should remove point and return 204', async () => {
      routeService.removePoint.mockResolvedValue(undefined);
      const req = { params: { pointId: 'point-1' } } as unknown as Request;
      const res = mockRes();
      await controller.removePoint(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('startOptimization', () => {
    it('should start route optimization', async () => {
      routeService.start.mockResolvedValue(createRoute());
      const req = { params: { id: 'route-1' }, body: { startLocation: { lat: 10, lng: -66 } } } as unknown as Request;
      const res = mockRes();
      await controller.startOptimization(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('completeDelivery', () => {
    it('should complete delivery and return point', async () => {
      routeService.completeDelivery.mockResolvedValue(createRoute().points[0]);
      const req = { params: { pointId: 'point-1' } } as unknown as Request;
      const res = mockRes();
      await controller.completeDelivery(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
