import { Company } from "@/domain/companies/entities/Company";

export interface ICompanyRepository {
  all(): Promise<Company[]>;
  create(company: Company): Promise<void>;
  find(value: string, field?: string): Promise<Company | null>;
  addUser(companyId: string, userId: string): Promise<void>;
  update(company: Company): Promise<void>;
  delete(companyId: string): Promise<void>;
}
