import { Request, Response } from 'express';
import PaymentMethodsController from '@/presentation/orders/controllers/PaymentMethods.controller';
import IPaymentMethodsService from '@/application/orders/services/interfaces/IPaymentMethodsService';
import PaymentMethod from '@/domain/orders/entities/PaymentMethod';

describe('PaymentMethodsController', () => {
  const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res as Response;
  };

  let paymentMethodsService: jest.Mocked<IPaymentMethodsService>;
  let controller: PaymentMethodsController;

  beforeEach(() => {
    paymentMethodsService = {
      getAllByCompany: jest.fn(),
      create: jest.fn(),
    } as any;
    controller = new PaymentMethodsController(paymentMethodsService);
  });

  describe('getAllByCompany', () => {
    it('should return payment methods for company', async () => {
      paymentMethodsService.getAllByCompany.mockResolvedValue([
        new PaymentMethod({ id: 'm1', name: 'Cash', companyId: 'comp-1' }),
      ]);
      const req = { headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.getAllByCompany(req, res);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });

  describe('create', () => {
    it('should create payment method and return 201', async () => {
      paymentMethodsService.create.mockResolvedValue(
        new PaymentMethod({ id: 'm1', name: 'Card', companyId: 'comp-1' })
      );
      const req = { body: { name: 'Card' }, headers: { 'x-company-id': 'comp-1' } } as unknown as Request;
      const res = mockRes();
      await controller.create(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'Card' }));
    });
  });
});
