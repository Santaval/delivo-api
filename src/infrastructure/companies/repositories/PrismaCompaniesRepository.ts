import { Company } from "@/domain/companies/entities/Company";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaCompanyMapper } from "../mappers/PrismaCompanyMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";

export default class PrismaCompaniesRepository implements ICompanyRepository {

  private readonly client: Prisma.TransactionClient;

  constructor(client?: Prisma.TransactionClient) {
    this.client = client || prisma;
  }

  /**
   * Fetch all companies from the database.
   * @returns A promise that resolves to an array of Company entities. 
   */
  async all(): Promise<Company[]> {
    try {
      const companies = await this.client.company.findMany();
      return companies.map((company) => PrismaCompanyMapper.toDomain(company));
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw new DatabaseError("Could not fetch companies");
    }
  }

  /**
   * Find a company by a specific field.
   * @param value The value to search for.
   * @param field The field to search in (defaults to "id").
   * @returns A promise that resolves to a Company entity or null if not found.
   */
  async find(value: string, field?: string): Promise<Company | null> {
    try {
      const company = await this.client.company.findFirst({
        where: {
          [field || "id"]: value,
        },
      });
      return company ? PrismaCompanyMapper.toDomain(company) : null;
    } catch (error) {
      console.error("Error finding company:", error);
      throw new DatabaseError("Could not find company");
    }
  }

  /**
   * Create a new company in the database.
   * @param company The Company entity to create.
   * @returns A promise that resolves when the company is created.
   */
  async create(company: Company): Promise<void> {
    try {
      await this.client.company.create(PrismaCompanyMapper.toPersistence(company));
    } catch (error) {
      console.error("Error creating company:", error);
      throw new DatabaseInsertError("Could not create company");
    }
  }

  /**
   * Update an existing company in the database.
   * @param company The Company entity to update.
   * @returns A promise that resolves when the company is updated.
   */
  async update(company: Company): Promise<void> {
    try {
      await this.client.company.update({
        where: { id: company.id },
        data: PrismaCompanyMapper.toPersistence(company).data,
      });
    } catch (error) {
      console.error("Error updating company:", error);
      throw new DatabaseInsertError("Could not update company");
    }
  }

  /**
   * Delete a company from the database.
   * @param companyId The ID of the company to delete.
   * @returns A promise that resolves when the company is deleted.
   */
  async delete(companyId: string): Promise<void> {
    try {
      await this.client.company.delete({
        where: { id: companyId },
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      throw new DatabaseInsertError("Could not delete company");
    }
  }
  /**
   * Delete a company along with every row that references it.
   *
   * The schema declares all company FKs as ON DELETE RESTRICT, so we must remove
   * dependents in topological order (leaves -> root) before deleting the company.
   * Uses raw `deleteMany` on the transaction client instead of the application
   * services, because `Client` and `Product` are soft-delete models whose
   * repositories filter on `deletedAt: null`; going through the services would
   * leave soft-deleted rows alive and the final `company.delete()` would fail
   * against RESTRICT.
   *
   * Order (per issue #40):
   *   RoutePoint -> ClientPayment -> ClientBillItem -> ClientBill -> Route ->
   *   SupplierBillItem -> SupplierBill -> Supplier -> PaymentMethod -> Product ->
   *   Client -> TaxPeriod -> Subscription -> CompanyInvitation -> UserCompany ->
   *   Company
   *
   * Note on `ClientBillItem_productId_fkey`: it is ON DELETE SET NULL on a
   * NOT NULL column. It is intentionally left untouched here; by deleting
   * ClientBillItem before Product we never trigger it.
   *
   * @param companyId The ID of the company to delete with all its data.
   */
  async deleteWithAllData(companyId: string): Promise<void> {
    try {
      await this.client.routePoint.deleteMany({ where: { route: { companyId } } });
      await this.client.clientPayment.deleteMany({ where: { bill: { companyId } } });
      await this.client.clientBillItem.deleteMany({ where: { bill: { companyId } } });
      await this.client.clientBill.deleteMany({ where: { companyId } });
      await this.client.route.deleteMany({ where: { companyId } });

      await this.client.supplierBillItem.deleteMany({ where: { bill: { companyId } } });
      await this.client.supplierBill.deleteMany({ where: { companyId } });
      await this.client.supplier.deleteMany({ where: { companyId } });

      await this.client.paymentMethod.deleteMany({ where: { companyId } });
      await this.client.product.deleteMany({ where: { companyId } });
      await this.client.client.deleteMany({ where: { companyId } });

      await this.client.taxPeriod.deleteMany({ where: { companyId } });
      await this.client.subscription.deleteMany({ where: { companyId } });

      await this.client.companyInvitation.deleteMany({ where: { companyId } });
      await this.client.userCompany.deleteMany({ where: { companyId } });

      await this.client.company.delete({
        where: { id: companyId },
      });
    } catch (error) {
      console.error("Error deleting company with all data:", error);
      throw new DatabaseInsertError("Could not delete company with all data");
    }
  }
  async addUser(companyId: string, userId: string): Promise<void> {
    try {
      await this.client.userCompany.create({
        data: {
          company: {
            connect: { id: companyId },
          },
          user: {
            connect: { id: userId },
          },
          role: "OWNER",
        },
      });
    } catch (error) {
      console.error("Error adding user to company:", error);
      throw new DatabaseInsertError("Could not add user to company");
    }
  }

             
}
