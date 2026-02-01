import { Supplier } from "@/domain/suppliers/entities/Supplier";
import { CreateSupplierRequest } from "../requests/CreateSupplierRequest";
import { UpdateSupplierRequest } from "../requests/UpdateSupplierRequest";
import { SupplierResponse } from "../responses/SupplierResponse";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";

export default class SupplierDtoMapper {
  static fromCreateRequest(request: CreateSupplierRequest, idGenerator: IIDGenerator): Supplier {
    return new Supplier({
      id: idGenerator.generate(),
      name: request.name,
      companyId: request.companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromUpdateRequest(request: UpdateSupplierRequest, existingSupplier: Supplier): Supplier {
    return new Supplier({
      id: request.id,
      name: request.name || existingSupplier.name,
      companyId: existingSupplier.companyId,
      createdAt: existingSupplier.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static toResponse(supplier: Supplier): SupplierResponse {
    return {
      id: supplier.id,
      name: supplier.name,
      companyId: supplier.companyId,
      createdAt: supplier.createdAt.toISOString(),
      updatedAt: supplier.updatedAt.toISOString(),
    };
  }

  static toResponseArray(suppliers: Supplier[]): SupplierResponse[] {
    return suppliers.map(supplier => this.toResponse(supplier));
  }
}
