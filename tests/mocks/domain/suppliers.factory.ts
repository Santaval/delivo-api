import { Supplier } from '@/domain/suppliers/entities/Supplier';
import { SupplierConstructorProps } from '@/domain/suppliers/entities/Supplier';

export const createSupplier = (overrides: Partial<SupplierConstructorProps> = {}): Supplier => {
  const props: SupplierConstructorProps = {
    id: 'supplier-1',
    name: 'Test Supplier',
    companyId: 'company-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
  return new Supplier(props);
};