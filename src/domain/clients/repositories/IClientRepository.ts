import { Client } from "@/domain/clients/entities/Client";

export interface IClientRepository {
  all(): Promise<Client[]>;
  create(client: Client): Promise<void>;
  find(value: string | number, field?: string): Promise<Client | null>;
  update(client: Client): Promise<void>;
  delete(clientId: number): Promise<void>;
  findByCompanyId(companyId: number): Promise<Client[]>;
  findByEmail(email: string): Promise<Client | null>;
}
