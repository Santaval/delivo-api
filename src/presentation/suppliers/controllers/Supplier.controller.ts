import { Request, Response } from "express";
import { ISupplierService } from "@/application/suppliers/services/interfaces/ISupplierService";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";
import SupplierDtoMapper from "../mappers/Supplier.mapper";
import { CreateSupplierRequest } from "../requests/CreateSupplierRequest";
import { UpdateSupplierRequest } from "../requests/UpdateSupplierRequest";

export default class SupplierController {
  constructor(
    private readonly supplierService: ISupplierService,
    private readonly idGenerator: IIDGenerator,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const request: CreateSupplierRequest = req.body;
    const supplier = SupplierDtoMapper.fromCreateRequest(request, this.idGenerator);
    const createdSupplier = await this.supplierService.create(supplier);
    res.status(201).json(SupplierDtoMapper.toResponse(createdSupplier));
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const suppliers = await this.supplierService.findAll();
    res.json(SupplierDtoMapper.toResponseArray(suppliers));
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const supplier = await this.supplierService.find(id);
    
    if (!supplier) {
      res.status(404).json({ message: "Proveedor no encontrado" });
      return;
    }
    
    res.json(SupplierDtoMapper.toResponse(supplier));
  }

  async findByCompany(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    const suppliers = await this.supplierService.findByCompanyId(companyId);
    res.json(SupplierDtoMapper.toResponseArray(suppliers));
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const existingSupplier = await this.supplierService.find(id);
    
    if (!existingSupplier) {
      res.status(404).json({ message: "Proveedor no encontrado" });
      return;
    }

    const request: UpdateSupplierRequest = {
      id,
      ...req.body
    };
    
    const supplier = SupplierDtoMapper.fromUpdateRequest(request, existingSupplier);
    const updatedSupplier = await this.supplierService.update(supplier);
    res.json(SupplierDtoMapper.toResponse(updatedSupplier));
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.supplierService.delete(id);
    res.status(204).send();
  }
}
