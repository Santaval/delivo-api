/* eslint-disable @typescript-eslint/no-explicit-any */
import { Supplier } from "@/domain/suppliers/entities/Supplier";
import { ISupplierRepository } from "@/domain/suppliers/repositories/ISupplierRepository";
import { ISupplierService } from "../interfaces/ISupplierService";
import { SupplierCreationError } from "../../errors/SupplierCreationError";
import { SupplierNotFoundError } from "../../errors/SupplierNotFoundError";

export class SupplierService implements ISupplierService {
    constructor(
        private readonly supplierRepository: ISupplierRepository,
    ) {
    }
    
    /**
     * Create supplier service
     * @param supplier
     * @returns {Promise<Supplier>}
     */
    async create(supplier: Supplier): Promise<Supplier> {
        await this.supplierRepository.create(supplier);
        const createdSupplier = await this.supplierRepository.find(supplier.id, "id");
        if (!createdSupplier) throw new SupplierCreationError();

        return createdSupplier;
    }

    async find(value: any, field: string = "id"): Promise<Supplier | null> {
        return this.supplierRepository.find(value, field);
    }

    async update(supplier: Supplier): Promise<Supplier> {
        // Verify supplier exists
        const existingSupplier = await this.supplierRepository.find(supplier.id, "id");
        if (!existingSupplier) throw new SupplierNotFoundError();

        await this.supplierRepository.update(supplier);
        const updatedSupplier = await this.supplierRepository.find(supplier.id, "id");
        if (!updatedSupplier) throw new SupplierCreationError("Failed to update supplier");
        
        return updatedSupplier;
    }

    async delete(supplierId: string): Promise<void> {
        // Verify supplier exists
        const existingSupplier = await this.supplierRepository.find(supplierId, "id");
        if (!existingSupplier) throw new SupplierNotFoundError();

        await this.supplierRepository.delete(supplierId);
    }

    async findAll(): Promise<Supplier[]> {
        return this.supplierRepository.all();
    }

    async findByCompanyId(companyId: string): Promise<Supplier[]> {
        return this.supplierRepository.findByCompanyId(companyId);
    }
}
