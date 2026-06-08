import { createSupplier } from '@/tests/mocks/domain';

describe('Supplier', () => {
  it('should create a supplier with valid properties', () => {
    const supplier = createSupplier();

    expect(supplier.id).toBe('supplier-1');
    expect(supplier.name).toBe('Test Supplier');
    expect(supplier.companyId).toBe('company-1');
    expect(supplier.createdAt).toBeInstanceOf(Date);
    expect(supplier.updatedAt).toBeInstanceOf(Date);
  });

  it('should create a supplier with custom name', () => {
    const supplier = createSupplier({ name: 'Custom Supplier' });

    expect(supplier.name).toBe('Custom Supplier');
    expect(supplier.id).toBe('supplier-1');
  });

  it('should create a supplier with custom companyId', () => {
    const supplier = createSupplier({ companyId: 'company-99' });

    expect(supplier.companyId).toBe('company-99');
  });

  it('should parse ISO date strings correctly', () => {
    const supplier = createSupplier({
      createdAt: '2023-06-15T10:30:00.000Z',
      updatedAt: '2023-06-15T10:30:00.000Z',
    });

    expect(supplier.createdAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
    expect(supplier.updatedAt).toEqual(new Date('2023-06-15T10:30:00.000Z'));
  });

  it('should throw when created with empty id', () => {
    expect(() => createSupplier({ id: '' })).toThrow();
  });

  it('should throw when created with empty companyId', () => {
    expect(() => createSupplier({ companyId: '' })).toThrow();
  });
});