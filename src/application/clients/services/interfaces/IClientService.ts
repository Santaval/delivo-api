/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@/domain/clients/entities/Client";

export interface IClientService {
  create(client: Client): Promise<Client>;
  find(value: any, field?: string): Promise<Client | null>;
  update(client: Client): Promise<Client>;
  delete(clientId: string): Promise<void>;
  findAll(): Promise<Client[]>;
  findByCompanyId(companyId: string): Promise<Client[]>;
  findByEmail(email: string): Promise<Client | null>;
}
