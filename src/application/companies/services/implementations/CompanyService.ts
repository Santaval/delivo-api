/* eslint-disable @typescript-eslint/no-explicit-any */
import { Company } from "@/domain/companies/entities/Company";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { ICompanyCreationUnitOfWork } from "@/domain/companies/unitsOfWork/CompanyCreationUnitOfWork";
import { WELCOME_CREDITS } from "@/application/credits/CreditPolicy";
import { ICompanyService } from "../interfaces/ICompanyService";
import { CompanyCreationError } from "../../errors/CompanyCreationError";
import { CompanyNotFoundError } from "../../errors/CompanyNotFoundError";

export class CompanyService implements ICompanyService {
    constructor(
        private readonly companyRepository: ICompanyRepository,
        private readonly companyCreationUOW: ICompanyCreationUnitOfWork,
    ) {
    }

    /**
     * Create company service.
     *
     * The company, its owner membership and its welcome credit grant are created in a
     * single transaction: every organization starts with the welcome credits, and none can
     * ever exist without a credit balance.
     * @param company
     * @returns {Promise<Company>}
     */
    async create(company: Company, userId: string): Promise<Company> {
        const createdCompany = await this.companyCreationUOW.runInTransaction(async (context) => {
            const companyRepository = context.getCompanyRepository();
            const creditRepository = context.getCreditRepository();

            await companyRepository.create(company);
            // add user to company
            await companyRepository.addUser(company.id, userId);
            await creditRepository.grant({ companyId: company.id, delta: WELCOME_CREDITS, reason: "WELCOME_GRANT" });

            return companyRepository.find(company.id, "id");
        });

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
