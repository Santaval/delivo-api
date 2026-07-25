import { Client } from "@/domain/clients/entities/Client";

export interface IClientRepository {
  all(): Promise<Client[]>;
  create(client: Client): Promise<Client>;
  find(value: string | number, field?: string): Promise<Client | null>;
  update(client: Client): Promise<void>;
  delete(clientId: string): Promise<void>;
  findByCompanyId(companyId: string): Promise<Client[]>;
  findByEmail(email: string): Promise<Client | null>;
  findSoftDeleted(name: string, companyId: string, phoneNumber?: string): Promise<Client | null>;
  restore(existingId: string, client: Client): Promise<Client>;
  /**
   * Count active (non soft-deleted) clients belonging to a company.
   * @param companyId The ID of the company.
   * @returns A promise that resolves to the number of matching clients.
   */
  countByCompanyId(companyId: string): Promise<number>;
}
