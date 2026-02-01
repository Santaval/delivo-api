import { Client } from "@/domain/clients/entities/Client";
import { CreateClientRequest } from "../requests/CreateClientRequest";
import { UpdateClientRequest } from "../requests/UpdateClientRequest";
import { ClientResponse } from "../responses/ClientResponse";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";

export default class ClientDtoMapper {
  static fromCreateRequest(request: CreateClientRequest, idGenerator: IIDGenerator): Client {
    return new Client({
      id: idGenerator.generate(),
      name: request.name,
      phoneNumber: request.phoneNumber,
      email: request.email,
      companyId: request.companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static fromUpdateRequest(request: UpdateClientRequest, existingClient: Client): Client {
    return new Client({
      id: request.id,
      name: request.name || existingClient.name,
      phoneNumber: request.phoneNumber !== undefined ? request.phoneNumber : existingClient.phoneNumber?.value,
      email: request.email !== undefined ? request.email : existingClient.email?.value,
      companyId: existingClient.companyId.value,
      createdAt: existingClient.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  static toResponse(client: Client): ClientResponse {
    return {
      id: client.id.value,
      name: client.name,
      phoneNumber: client.phoneNumber?.value,
      email: client.email?.value,
      companyId: client.companyId.value,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }

  static toResponseArray(clients: Client[]): ClientResponse[] {
    return clients.map(client => this.toResponse(client));
  }
}
