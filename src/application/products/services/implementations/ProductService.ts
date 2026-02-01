/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "@/domain/products/entities/Product";
import { IProductRepository } from "@/domain/products/repositories/IProductRepository";
import { IProductService } from "../interfaces/IProductService";
import { ProductCreationError } from "../../errors/ProductCreationError";
import { ProductNotFoundError } from "../../errors/ProductNotFoundError";

export class ProductService implements IProductService {
    constructor(
        private readonly productRepository: IProductRepository,
    ) {
    }
    
    /**
     * Create product service
     * @param product
     * @returns {Promise<Product>}
     */
    async create(product: Product): Promise<Product> {
        await this.productRepository.create(product);
        const createdProduct = await this.productRepository.find(product.id, "id");
        if (!createdProduct) throw new ProductCreationError();

        return createdProduct;
    }

    async find(value: any, field: string = "id"): Promise<Product | null> {
        return this.productRepository.find(value, field);
    }

    async update(product: Product): Promise<Product> {
        // Verify product exists
        const existingProduct = await this.productRepository.find(product.id, "id");
        if (!existingProduct) throw new ProductNotFoundError();

        await this.productRepository.update(product);
        const updatedProduct = await this.productRepository.find(product.id, "id");
        if (!updatedProduct) throw new ProductCreationError("Failed to update product");
        
        return updatedProduct;
    }

    async delete(productId: string): Promise<void> {
        // Verify product exists
        const existingProduct = await this.productRepository.find(productId, "id");
        if (!existingProduct) throw new ProductNotFoundError();

        await this.productRepository.delete(productId);
    }

    async findAll(): Promise<Product[]> {
        return this.productRepository.all();
    }

    async findByCompanyId(companyId: string): Promise<Product[]> {
        return this.productRepository.findByCompanyId(companyId);
    }

    async findByName(name: string, companyId: string): Promise<Product | null> {
        return this.productRepository.findByName(name, companyId);
    }

    async findByPriceRange(minPrice: number, maxPrice: number, companyId: string): Promise<Product[]> {
        return this.productRepository.findByPriceRange(minPrice, maxPrice, companyId);
    }
}
