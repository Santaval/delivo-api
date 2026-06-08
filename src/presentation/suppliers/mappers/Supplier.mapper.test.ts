import { Supplier } from '@/domain/suppliers/entities/Supplier';
import SupplierDtoMapper from './Supplier.mapper';
import { CreateSupplierRequest } from '../requests/CreateSupplierRequest';
import { UpdateSupplierRequest } from '../requests/UpdateSupplierRequest';

describe('SupplierDtoMapper', () => {
  const mockIdGenerator = { generate: () => 'gen-id-456' };

  describe('fromCreateRequest', () => {
    it('should map CreateSupplierRequest to Supplier', () => {
      const request: CreateSupplierRequest = { name: 'Supplier A', companyId: 'comp-1' };
      const supplier = SupplierDtoMapper.fromCreateRequest(request, mockIdGenerator as any);
      expect(supplier).toBeInstanceOf(Supplier);
      expect(supplier.name).toBe('Supplier A');
      expect(supplier.companyId).toBe('comp-1');
    });
  });

  describe('fromUpdateRequest', () => {
    it('should merge request with existing supplier', () => {
      const existing = new Supplier({
        id: 'sup-1',
        name: 'Old Name',
        companyId: 'comp-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const request: UpdateSupplierRequest = { id: 'sup-1', name: 'New Name' };
      const updated = SupplierDtoMapper.fromUpdateRequest(request, existing);
      expect(updated.name).toBe('New Name');
      expect(updated.companyId).toBe('comp-1');
    });
  });

  describe('toResponse', () => {
    it('should map Supplier to SupplierResponse', () => {
      const supplier = new Supplier({
        id: 'sup-1',
        name: 'Supplier A',
        companyId: 'comp-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      const response = SupplierDtoMapper.toResponse(supplier);
      expect(response.id).toBe('sup-1');
      expect(response.name).toBe('Supplier A');
    });
  });

  describe('toResponseArray', () => {
    it('should map array of Suppliers', () => {
      const suppliers = [
        new Supplier({ id: 's1', name: 'A', companyId: 'c1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
      ];
      const responses = SupplierDtoMapper.toResponseArray(suppliers);
      expect(responses).toHaveLength(1);
      expect(responses[0].name).toBe('A');
    });
  });
});
