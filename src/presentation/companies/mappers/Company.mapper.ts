import { Company } from "@/domain/companies/entities/Company";
import { CreateCompanyRequest } from "../requests/CreateCompanyRequest";
import { UpdateCompanyRequest } from "../requests/UpdateCompanyRequest";
import { CompanyResponse } from "../responses/CompanyResponse";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";

export default class CompanyDtoMapper {
  static fromCreateRequest(request: CreateCompanyRequest, idGenerator: IIDGenerator): Company {
    return new Company({
      id: idGenerator.generate(),
      name: request.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromUpdateRequest(request: UpdateCompanyRequest): Company {
    return new Company({
      id: request.id,
      name: request.name || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static toResponse(company: Company): CompanyResponse {
    return {
      id: company.id,
      name: company.name,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }

  static toResponseArray(companies: Company[]): CompanyResponse[] {
    return companies.map(company => this.toResponse(company));
  }
}
