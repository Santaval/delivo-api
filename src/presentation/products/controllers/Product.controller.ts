import { Request, Response } from "express";
import { IProductService } from "@/application/products/services/interfaces/IProductService";
import { IIDGenerator } from "@/domain/core/services/IIDGenerator";
import ProductDtoMapper from "../mappers/Product.mapper";
import { CreateProductRequest } from "../requests/CreateProductRequest";
import { UpdateProductRequest } from "../requests/UpdateProductRequest";

export default class ProductController {
  constructor(
    private readonly productService: IProductService,
    private readonly idGenerator: IIDGenerator,
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    const request: CreateProductRequest = req.body;
    const product = ProductDtoMapper.fromCreateRequest(request, this.idGenerator);
    const createdProduct = await this.productService.create(product);
    res.status(201).json(ProductDtoMapper.toResponse(createdProduct));
  }

  async findAll(req: Request, res: Response): Promise<void> {
    const products = await this.productService.findAll();
    res.json(ProductDtoMapper.toResponseArray(products));
  }

  async findById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const product = await this.productService.find(id);
    
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }
    
    res.json(ProductDtoMapper.toResponse(product));
  }

  async findByCompany(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    const products = await this.productService.findByCompanyId(companyId);
    res.json(ProductDtoMapper.toResponseArray(products));
  }

  async findByPriceRange(req: Request, res: Response): Promise<void> {
    const { companyId } = req.params;
    const { minPrice, maxPrice } = req.query;
    
    if (!minPrice || !maxPrice) {
      res.status(400).json({ message: "Se requieren minPrice y maxPrice" });
      return;
    }

    const products = await this.productService.findByPriceRange(
      Number(minPrice), 
      Number(maxPrice), 
      companyId
    );
    res.json(ProductDtoMapper.toResponseArray(products));
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const existingProduct = await this.productService.find(id);
    
    if (!existingProduct) {
      res.status(404).json({ message: "Producto no encontrado" });
      return;
    }

    const request: UpdateProductRequest = {
      id,
      ...req.body
    };
    
    const product = ProductDtoMapper.fromUpdateRequest(request, existingProduct);
    const updatedProduct = await this.productService.update(product);
    res.json(ProductDtoMapper.toResponse(updatedProduct));
  }

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await this.productService.delete(id);
    res.status(204).send();
  }
}
