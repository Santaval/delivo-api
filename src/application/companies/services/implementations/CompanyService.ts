/* eslint-disable @typescript-eslint/no-explicit-any */
import { Company } from "@/domain/companies/entities/Company";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { ICompanyService } from "../interfaces/ICompanyService";
import { CompanyCreationError } from "../../errors/CompanyCreationError";
import { CompanyNotFoundError } from "../../errors/CompanyNotFoundError";

export class CompanyService implements ICompanyService {
    constructor(
        private readonly companyRepository: ICompanyRepository,
    ) {
    }
    
    /**
     * Create company service
     * @param company
     * @returns {Promise<Company>}
     */
    async create(company: Company): Promise<Company> {
        await this.companyRepository.create(company);
        const createdCompany = await this.companyRepository.find(company.id, "id");
        if (!createdCompany) throw new CompanyCreationError();

        return createdCompany;
    }

    async find(value: any, field: string = "id"): Promise<Company | null> {
        return this.companyRepository.find(value, field);
    }

    async update(company: Company): Promise<Company> {
        // Verify company exists
        const existingCompany = await this.companyRepository.find(company.id, "id");
        if (!existingCompany) throw new CompanyNotFoundError();

        await this.companyRepository.update(company);
        const updatedCompany = await this.companyRepository.find(company.id, "id");
        if (!updatedCompany) throw new CompanyCreationError("Failed to update company");
        
        return updatedCompany;
    }

    async delete(companyId: string): Promise<void> {
        // Verify company exists
        const existingCompany = await this.companyRepository.find(companyId, "id");
        if (!existingCompany) throw new CompanyNotFoundError();

        await this.companyRepository.delete(companyId);
    }

    async findAll(): Promise<Company[]> {
        return this.companyRepository.all();
    }
}
