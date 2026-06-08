import PaymentMethodsService from '@/application/orders/services/implementations/PaymentmethodsService';
import IPaymentMethodRepository from '@/domain/orders/repositories/IPaymentMethodRepository';
import { createPaymentMethod } from '@/tests/mocks/domain';
import { CompanyId } from '@/domain/companies/valueObjects/companyId.valueObject';

describe('PaymentMethodsService', () => {
  let service: PaymentMethodsService;
  let mockRepository: jest.Mocked<IPaymentMethodRepository>;

  beforeEach(() => {
    mockRepository = {
      allByCompany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<IPaymentMethodRepository>;

    service = new PaymentMethodsService(mockRepository);
  });

  describe('getAllByCompany', () => {
    it('returns all payment methods for company', async () => {
      const paymentMethods = [
        createPaymentMethod({ id: 'pm-1' }),
        createPaymentMethod({ id: 'pm-2', name: 'Credit Card' }),
      ];
      mockRepository.allByCompany.mockResolvedValue(paymentMethods);
      const companyId = { value: 'company-1' } as CompanyId;

      const result = await service.getAllByCompany(companyId);

      expect(mockRepository.allByCompany).toHaveBeenCalledWith(companyId);
      expect(result).toHaveLength(2);
    });

    it('returns empty array when no payment methods', async () => {
      mockRepository.allByCompany.mockResolvedValue([]);
      const companyId = { value: 'company-1' } as CompanyId;

      const result = await service.getAllByCompany(companyId);

      expect(result).toHaveLength(0);
    });
  });

  describe('create', () => {
    it('creates and returns payment method', async () => {
      const paymentMethod = createPaymentMethod();
      mockRepository.create.mockResolvedValue(paymentMethod);

      const result = await service.create(paymentMethod);

      expect(mockRepository.create).toHaveBeenCalledWith(paymentMethod);
      expect(result).toBe(paymentMethod);
    });
  });
});