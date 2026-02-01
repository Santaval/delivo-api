/* eslint-disable @typescript-eslint/no-explicit-any */
import { Supplier } from "@/domain/suppliers/entities/Supplier";

export interface ISupplierService {
  create(supplier: Supplier): Promise<Supplier>;
  find(value: any, field?: string): Promise<Supplier | null>;
  update(supplier: Supplier): Promise<Supplier>;
  delete(supplierId: string): Promise<void>;
  findAll(): Promise<Supplier[]>;
  findByCompanyId(companyId: string): Promise<Supplier[]>;
}
