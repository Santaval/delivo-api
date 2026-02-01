import { Request, Response } from "express";
import { IClientService } from "@/application/clients/services/interfaces/IClientService";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";
import ClientDtoMapper from "../mappers/Client.mapper";
import { CreateClientRequest } from "../requests/CreateClientRequest";
import { UpdateClientRequest } from "../requests/UpdateClientRequest";

export default class ClientController {
  constructor(
    private readonly clientService: IClientService,
    private readonly idGenerator: IIDGenerator,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const request: CreateClientRequest = req.body;
    const client = ClientDtoMapper.fromCreateRequest(request, this.idGenerator);
    const createdClient = await this.clientService.create(client);
    res.status(201).json(ClientDtoMapper.toResponse(createdClient));
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const clients = await this.clientService.findAll();
    res.json(ClientDtoMapper.toResponseArray(clients));
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const client = await this.clientService.find(id);
    
    if (!client) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }
    
    res.json(ClientDtoMapper.toResponse(client));
  }

  async findByCompany(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    const clients = await this.clientService.findByCompanyId(companyId);
    res.json(ClientDtoMapper.toResponseArray(clients));
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const existingClient = await this.clientService.find(id);
    
    if (!existingClient) {
      res.status(404).json({ message: "Cliente no encontrado" });
      return;
    }

    const request: UpdateClientRequest = {
      id,
      ...req.body
    };
    
    const client = ClientDtoMapper.fromUpdateRequest(request, existingClient);
    const updatedClient = await this.clientService.update(client);
    res.json(ClientDtoMapper.toResponse(updatedClient));
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.clientService.delete(id);
    res.status(204).send();
  }
}
