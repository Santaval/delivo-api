import { Supplier } from "@/domain/suppliers/entities/Supplier";
import { ISupplierRepository } from "@/domain/suppliers/repositories/ISupplierRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaSupplierMapper } from "../mappers/PrismaSupplierMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";

export default class PrismaSuppliersRepository implements ISupplierRepository {

  constructor() { }

  /**
   * Fetch all suppliers from the database.
   * @returns A promise that resolves to an array of Supplier entities. 
   */
  async all(): Promise<Supplier[]> {
    try {
      const suppliers = await prisma.supplier.findMany();
      return suppliers.map((supplier) => PrismaSupplierMapper.toDomain(supplier));
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw new DatabaseError("Could not fetch suppliers");
    }
  }

  /**
   * Find a supplier by a specific field.
   * @param value The value to search for.
   * @param field The field to search in (defaults to "id").
   * @returns A promise that resolves to a Supplier entity or null if not found.
   */
  async find(value: string, field?: string): Promise<Supplier | null> {
    try {
      const supplier = await prisma.supplier.findFirst({
        where: {
          [field || "id"]: value,
        },
      });
      return supplier ? PrismaSupplierMapper.toDomain(supplier) : null;
    } catch (error) {
      console.error("Error finding supplier:", error);
      throw new DatabaseError("Could not find supplier");
    }
  }

  /**
   * Create a new supplier in the database.
   * @param supplier The Supplier entity to create.
   * @returns A promise that resolves when the supplier is created.
   */
  async create(supplier: Supplier): Promise<void> {
    try {
      await prisma.supplier.create(PrismaSupplierMapper.toPersistence(supplier));
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw new DatabaseInsertError("Could not create supplier");
    }
  }

  /**
   * Update an existing supplier in the database.
   * @param supplier The Supplier entity to update.
   * @returns A promise that resolves when the supplier is updated.
   */
  async update(supplier: Supplier): Promise<void> {
    try {
      await prisma.supplier.update({
        where: { id: supplier.id },
        data: PrismaSupplierMapper.toPersistence(supplier).data,
      });
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw new DatabaseInsertError("Could not update supplier");
    }
  }

  /**
   * Delete a supplier from the database.
   * @param supplierId The ID of the supplier to delete.
   * @returns A promise that resolves when the supplier is deleted.
   */
  async delete(supplierId: string): Promise<void> {
    try {
      await prisma.supplier.delete({
        where: { id: supplierId },
      });
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw new DatabaseInsertError("Could not delete supplier");
    }
  }

  /**
   * Find all suppliers for a specific company.
   * @param companyId The ID of the company.
   * @returns A promise that resolves to an array of Supplier entities.
   */
  async findByCompanyId(companyId: string): Promise<Supplier[]> {
    try {
      const suppliers = await prisma.supplier.findMany({
        where: { companyId },
      });
      return suppliers.map((supplier) => PrismaSupplierMapper.toDomain(supplier));
    } catch (error) {
      console.error("Error finding suppliers by company:", error);
      throw new DatabaseError("Could not find suppliers by company");
    }
  }
}
