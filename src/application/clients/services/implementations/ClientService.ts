/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@/domain/clients/entities/Client";
import { IClientRepository } from "@/domain/clients/repositories/IClientRepository";
import { IClientService } from "../interfaces/IClientService";
import { ClientCreationError } from "../../errors/ClientCreationError";
import { ClientNotFoundError } from "../../errors/ClientNotFoundError";

export class ClientService implements IClientService {
    constructor(
        private readonly clientRepository: IClientRepository,
    ) {
    }
    
    /**
     * Create client service
     * @param client
     * @returns {Promise<Client>}
     */
    async create(client: Client): Promise<Client> {

        const createdClient = await this.clientRepository.create(client);
        if (!createdClient) throw new ClientCreationError();

        return createdClient;
    }

    async find(value: any, field: string = "id"): Promise<Client | null> {
        return this.clientRepository.find(value, field);
    }

    async update(client: Client): Promise<Client> {
        // Verify client exists
        const existingClient = await this.clientRepository.find(client.id.value, "id");
        if (!existingClient) throw new ClientNotFoundError();

        await this.clientRepository.update(client);
        const updatedClient = await this.clientRepository.find(client.id.value, "id");
        if (!updatedClient) throw new ClientCreationError("Failed to update client");
        
        return updatedClient;
    }

    async delete(clientId: string): Promise<void> {
        // Verify client exists
        const existingClient = await this.clientRepository.find(clientId, "id");
        if (!existingClient) throw new ClientNotFoundError();

        await this.clientRepository.delete(clientId);
    }

    async findAll(): Promise<Client[]> {
        return this.clientRepository.all();
    }

    async findByCompanyId(companyId: string): Promise<Client[]> {
        return this.clientRepository.findByCompanyId(companyId);
    }

    async findByEmail(email: string): Promise<Client | null> {
        return this.clientRepository.findByEmail(email);
    }
}
