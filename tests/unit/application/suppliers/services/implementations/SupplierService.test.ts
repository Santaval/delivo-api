import { SupplierService } from '@/application/suppliers/services/implementations/SupplierService';
import { ISupplierService } from '@/application/suppliers/services/interfaces/ISupplierService';
import { ISupplierRepository } from '@/domain/suppliers/repositories/ISupplierRepository';
import { SupplierCreationError } from '@/application/suppliers/errors/SupplierCreationError';
import { SupplierNotFoundError } from '@/application/suppliers/errors/SupplierNotFoundError';
import { createSupplier } from '@/tests/mocks/domain';

describe('SupplierService', () => {
  let service: ISupplierService;
  let mockRepository: jest.Mocked<ISupplierRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      all: jest.fn(),
      findByCompanyId: jest.fn(),
    } as jest.Mocked<ISupplierRepository>;
    service = new SupplierService(mockRepository);
  });

  describe('create', () => {
    it('creates supplier and returns it', async () => {
      const supplier = createSupplier();
      mockRepository.create.mockResolvedValue();
      mockRepository.find.mockResolvedValue(supplier);

      const result = await service.create(supplier);

      expect(mockRepository.create).toHaveBeenCalledWith(supplier);
      expect(result).toBe(supplier);
    });

    it('throws SupplierCreationError when supplier not found after creation', async () => {
      const supplier = createSupplier();
      mockRepository.create.mockResolvedValue();
      mockRepository.find.mockResolvedValue(null);

      await expect(service.create(supplier)).rejects.toThrow(SupplierCreationError);
    });

    it('throws Error when repository throws during create', async () => {
      const supplier = createSupplier();
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(supplier)).rejects.toThrow(Error);
    });
  });

  describe('find', () => {
    it('finds supplier by id by default', async () => {
      const supplier = createSupplier();
      mockRepository.find.mockResolvedValue(supplier);

      const result = await service.find('supplier-1');

      expect(mockRepository.find).toHaveBeenCalledWith('supplier-1', 'id');
      expect(result).toBe(supplier);
    });

    it('finds supplier by custom field', async () => {
      const supplier = createSupplier();
      mockRepository.find.mockResolvedValue(supplier);

      const result = await service.find('test@supplier.com', 'email');

      expect(mockRepository.find).toHaveBeenCalledWith('test@supplier.com', 'email');
      expect(result).toBe(supplier);
    });

    it('returns null when supplier not found', async () => {
      mockRepository.find.mockResolvedValue(null);

      const result = await service.find('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('updates supplier and returns updated version', async () => {
      const supplier = createSupplier({ name: 'Updated Supplier' });
      const updatedSupplier = createSupplier({ name: 'Updated Supplier' });
      mockRepository.find.mockResolvedValue(supplier);
      mockRepository.update.mockResolvedValue();
      mockRepository.find.mockResolvedValue(updatedSupplier);

      const result = await service.update(supplier);

      expect(mockRepository.update).toHaveBeenCalledWith(supplier);
      expect(result).toBe(updatedSupplier);
    });

    it('throws SupplierNotFoundError when supplier does not exist', async () => {
      const supplier = createSupplier();
      mockRepository.find.mockResolvedValue(null);

      await expect(service.update(supplier)).rejects.toThrow(SupplierNotFoundError);
    });

    it('throws SupplierCreationError when update fails to return supplier', async () => {
      const supplier = createSupplier();
      mockRepository.find
        .mockResolvedValueOnce(supplier)  // first call - supplier found
        .mockResolvedValueOnce(null);     // second call - supplier not found after update
      mockRepository.update.mockResolvedValue();

      await expect(service.update(supplier)).rejects.toThrow(SupplierCreationError);
    });
  });

  describe('delete', () => {
    it('deletes existing supplier', async () => {
      const supplier = createSupplier();
      mockRepository.find.mockResolvedValue(supplier);
      mockRepository.delete.mockResolvedValue();

      await service.delete('supplier-1');

      expect(mockRepository.delete).toHaveBeenCalledWith('supplier-1');
    });

    it('throws SupplierNotFoundError when supplier does not exist', async () => {
      mockRepository.find.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(SupplierNotFoundError);
    });
  });

  describe('findAll', () => {
    it('returns all suppliers', async () => {
      const suppliers = [createSupplier(), createSupplier({ id: 'supplier-2' })];
      mockRepository.all.mockResolvedValue(suppliers);

      const result = await service.findAll();

      expect(mockRepository.all).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('findByCompanyId', () => {
    it('returns suppliers for company', async () => {
      const suppliers = [createSupplier(), createSupplier({ id: 'supplier-2', companyId: 'company-1' })];
      mockRepository.findByCompanyId.mockResolvedValue(suppliers);

      const result = await service.findByCompanyId('company-1');

      expect(mockRepository.findByCompanyId).toHaveBeenCalledWith('company-1');
      expect(result).toHaveLength(2);
    });
  });
});