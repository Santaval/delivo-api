import { Request, Response } from "express";
import { ICompanyService } from "@/application/companies/services/interfaces/ICompanyService";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";
import CompanyDtoMapper from "../mappers/Company.mapper";
import { CreateCompanyRequest } from "../requests/CreateCompanyRequest";
import { UpdateCompanyRequest } from "../requests/UpdateCompanyRequest";

export default class CompanyController {
  constructor(
    private readonly companyService: ICompanyService,
    private readonly idGenerator: IIDGenerator,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    // @ts-expect-error
    const userId = req?.user?.id;
    const request: CreateCompanyRequest = req.body;
    const company = CompanyDtoMapper.fromCreateRequest(request, this.idGenerator);
    const createdCompany = await this.companyService.create(company, userId);
    res.json(CompanyDtoMapper.toResponse(createdCompany));
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const companies = await this.companyService.findAll();
    res.json(CompanyDtoMapper.toResponseArray(companies));
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const company = await this.companyService.find(id);
    
    if (!company) {
      res.status(404).json({ message: "Empresa no encontrada" });
      return;
    }
    
    res.json(CompanyDtoMapper.toResponse(company));
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const request: UpdateCompanyRequest = {
      id,
      ...req.body
    };
    
    const company = CompanyDtoMapper.fromUpdateRequest(request);
    const updatedCompany = await this.companyService.update(company);
    res.json(CompanyDtoMapper.toResponse(updatedCompany));
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.companyService.delete(id);
    res.status(204).send();
  }
}
