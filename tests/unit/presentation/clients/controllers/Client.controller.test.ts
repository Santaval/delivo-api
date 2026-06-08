import { Request, Response } from 'express';
import ClientController from '@/presentation/clients/controllers/Client.controller';
import { IClientService } from '@/application/clients/services/interfaces/IClientService';
import { Client } from '@/domain/clients/entities/Client';

describe('ClientController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  const createClient = (overrides?: Partial<any>): Client =>
    new Client({
      id: 'client-1',
      name: 'Juan Pérez',
      phoneNumber: '12345678',
      email: 'juan@test.com',
      companyId: 'comp-1',
      lat: 10.5,
      lng: -66.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...overrides,
    });

  let clientService: jest.Mocked<IClientService>;
  let controller: ClientController;

  beforeEach(() => {
    clientService = {
      create: jest.fn(),
      find: jest.fn(),
      findByCompanyId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    controller = new ClientController(clientService);
  });

  describe('create', () => {
    it('should create a client and return 201', async () => {
      const client = createClient();
      clientService.create.mockResolvedValue(client);
      const req = { body: { name: 'New Client' }, headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.create(req, res);
      expect(clientService.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('findById', () => {
    it('should return client when found', async () => {
      clientService.find.mockResolvedValue(createClient());
      const req = { params: { id: 'client-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'client-1' }));
    });

    it('should return 404 when not found', async () => {
      clientService.find.mockResolvedValue(null as any);
      const req = { params: { id: 'client-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('findByCompany', () => {
    it('should return clients for company', async () => {
      clientService.findByCompanyId.mockResolvedValue([createClient()]);
      const req = { headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.findByCompany(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('update', () => {
    it('should update and return client', async () => {
      const client = createClient();
      clientService.find.mockResolvedValue(client);
      clientService.update.mockResolvedValue(client);
      const req = { params: { id: 'client-1' }, body: { name: 'Updated' } } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'client-1' }));
    });

    it('should return 404 when client not found', async () => {
      clientService.find.mockResolvedValue(null as any);
      const req = { params: { id: 'client-1' }, body: {} } as unknown as Request;
      const res = mockRes();
      await controller.update(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('delete', () => {
    it('should delete and return 204', async () => {
      clientService.delete.mockResolvedValue(undefined);
      const req = { params: { id: 'client-1' } } as unknown as Request;
      const res = mockRes();
      await controller.delete(req, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
