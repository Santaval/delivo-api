import { Company } from "@/domain/companies/entities/Company";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaCompanyMapper } from "../mappers/PrismaCompanyMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";

export default class PrismaCompaniesRepository implements ICompanyRepository {

  constructor() { }

  /**
   * Fetch all companies from the database.
   * @returns A promise that resolves to an array of Company entities. 
   */
  async all(): Promise<Company[]> {
    try {
      const companies = await prisma.company.findMany();
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
      const company = await prisma.company.findFirst({
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
      await prisma.company.create(PrismaCompanyMapper.toPersistence(company));
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
      await prisma.company.update({
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
      await prisma.company.delete({
        where: { id: companyId },
      });
    } catch (error) {
      console.error("Error deleting company:", error);
      throw new DatabaseInsertError("Could not delete company");
    }
  }
  async addUser(companyId: string, userId: string): Promise<void> {
    try {
      await prisma.userCompany.create({
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
