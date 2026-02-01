import { Supplier } from "@/domain/suppliers/entities/Supplier";

export interface ISupplierRepository {
  all(): Promise<Supplier[]>;
  create(supplier: Supplier): Promise<void>;
  find(value: string, field?: string): Promise<Supplier | null>;
  update(supplier: Supplier): Promise<void>;
  delete(supplierId: string): Promise<void>;
  findByCompanyId(companyId: string): Promise<Supplier[]>;
}
