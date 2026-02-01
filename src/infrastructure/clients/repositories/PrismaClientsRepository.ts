import { Client } from "@/domain/clients/entities/Client";
import { IClientRepository } from "@/domain/clients/repositories/IClientRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaClientMapper } from "../mappers/PrismaClientMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";

export default class PrismaClientsRepository implements IClientRepository {

  constructor() { }

  /**
   * Fetch all clients from the database.
   * @returns A promise that resolves to an array of Client entities. 
   */
  async all(): Promise<Client[]> {
    try {
      const clients = await prisma.client.findMany();
      return clients.map((client) => PrismaClientMapper.toDomain(client));
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw new DatabaseError("Could not fetch clients");
    }
  }

  /**
   * Find a client by a specific field.
   * @param value The value to search for.
   * @param field The field to search in (defaults to "id").
   * @returns A promise that resolves to a Client entity or null if not found.
   */
  async find(value: string | number, field?: string): Promise<Client | null> {
    try {
      const client = await prisma.client.findFirst({
        where: {
          [field || "id"]: value,
        },
      });
      return client ? PrismaClientMapper.toDomain(client) : null;
    } catch (error) {
      console.error("Error finding client:", error);
      throw new DatabaseError("Could not find client");
    }
  }

  /**
   * Create a new client in the database.
   * @param client The Client entity to create.
   * @returns A promise that resolves when the client is created.
   */
  async create(client: Client): Promise<void> {
    try {
      await prisma.client.create(PrismaClientMapper.toPersistence(client));
    } catch (error) {
      console.error("Error creating client:", error);
      throw new DatabaseInsertError("Could not create client");
    }
  }

  /**
   * Update an existing client in the database.
   * @param client The Client entity to update.
   * @returns A promise that resolves when the client is updated.
   */
  async update(client: Client): Promise<void> {
    try {
      await prisma.client.update({
        where: { id: client.id.value },
        data: PrismaClientMapper.toPersistence(client).data,
      });
    } catch (error) {
      console.error("Error updating client:", error);
      throw new DatabaseInsertError("Could not update client");
    }
  }

  /**
   * Delete a client from the database.
   * @param clientId The ID of the client to delete.
   * @returns A promise that resolves when the client is deleted.
   */
  async delete(clientId: string): Promise<void> {
    try {
      await prisma.client.delete({
        where: { id: clientId },
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      throw new DatabaseInsertError("Could not delete client");
    }
  }

  /**
   * Find all clients for a specific company.
   * @param companyId The ID of the company.
   * @returns A promise that resolves to an array of Client entities.
   */
  async findByCompanyId(companyId: string): Promise<Client[]> {
    try {
      const clients = await prisma.client.findMany({
        where: { companyId },
      });
      return clients.map((client) => PrismaClientMapper.toDomain(client));
    } catch (error) {
      console.error("Error finding clients by company:", error);
      throw new DatabaseError("Could not find clients by company");
    }
  }

  /**
   * Find a client by email address.
   * @param email The email address to search for.
   * @returns A promise that resolves to a Client entity or null if not found.
   */
  async findByEmail(email: string): Promise<Client | null> {
    try {
      const client = await prisma.client.findFirst({
        where: { email },
      });
      return client ? PrismaClientMapper.toDomain(client) : null;
    } catch (error) {
      console.error("Error finding client by email:", error);
      throw new DatabaseError("Could not find client by email");
    }
  }
}
