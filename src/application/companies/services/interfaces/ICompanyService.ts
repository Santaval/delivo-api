/* eslint-disable @typescript-eslint/no-explicit-any */
import { Company } from "@/domain/companies/entities/Company";

export interface ICompanyService {
  create(company: Company, userId: string): Promise<Company>;
  find(value: any, field?: string): Promise<Company | null>;
  update(company: Company): Promise<Company>;
  delete(companyId: string): Promise<void>;
  findAll(): Promise<Company[]>;
}
