import { Client } from "@/domain/clients/entities/Client";

export interface IClientRepository {
  all(): Promise<Client[]>;
  create(client: Client): Promise<Client>;
  find(value: string | number, field?: string): Promise<Client | null>;
  update(client: Client): Promise<void>;
  delete(clientId: string): Promise<void>;
  findByCompanyId(companyId: string): Promise<Client[]>;
  findByEmail(email: string): Promise<Client | null>;
}
