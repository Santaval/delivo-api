import { Product } from "@/domain/products/entities/Product";
import { IProductRepository } from "@/domain/products/repositories/IProductRepository";
import { prisma } from "@/infrastructure/prisma/client";
import { PrismaProductMapper } from "../mappers/PrismaProductMapper";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";

export default class PrismaProductsRepository implements IProductRepository {

  private readonly client: Prisma.TransactionClient;

  constructor(client?: Prisma.TransactionClient) {
    this.client = client || prisma;
  }

  /**
   * Fetch all products from the database.
   * @returns A promise that resolves to an array of Product entities. 
   */
  async all(): Promise<Product[]> {
    try {
      const products = await this.client.product.findMany();
      return products.map((product) => PrismaProductMapper.toDomain(product));
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new DatabaseError("Could not fetch products");
    }
  }

  /**
   * Find a product by a specific field.
   * @param value The value to search for.
   * @param field The field to search in (defaults to "id").
   * @returns A promise that resolves to a Product entity or null if not found.
   */
  async find(value: string, field?: string): Promise<Product | null> {
    try {
      const product = await this.client.product.findFirst({
        where: {
          [field || "id"]: value,
        },
      });
      return product ? PrismaProductMapper.toDomain(product) : null;
    } catch (error) {
      console.error("Error finding product:", error);
      throw new DatabaseError("Could not find product");
    }
  }

  /**
   * Create a new product in the database.
   * @param product The Product entity to create.
   * @returns A promise that resolves when the product is created.
   */
  async create(product: Product): Promise<Product> {
    try {
      const createdProduct = await this.client.product.create(PrismaProductMapper.toPersistence(product));
      return PrismaProductMapper.toDomain(createdProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      throw new DatabaseInsertError("Could not create product");
    }
  }

  /**
   * Update an existing product in the database.
   * @param product The Product entity to update.
   * @returns A promise that resolves when the product is updated.
   */
  async update(product: Product): Promise<void> {
    try {
      await this.client.product.update({
        where: { id: product.id },
        data: PrismaProductMapper.toPersistence(product).data,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      throw new DatabaseInsertError("Could not update product");
    }
  }

  /**
   * Delete a product from the database.
   * @param productId The ID of the product to delete.
   * @returns A promise that resolves when the product is deleted.
   */
  async delete(productId: string): Promise<void> {
    try {
      await this.client.product.delete({
        where: { id: productId },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new DatabaseInsertError("Could not delete product");
    }
  }

  /**
   * Find all products for a specific company.
   * @param companyId The ID of the company.
   * @returns A promise that resolves to an array of Product entities.
   */
  async findByCompanyId(companyId: string): Promise<Product[]> {
    try {
      const products = await this.client.product.findMany({
        where: { companyId },
      });
      return products.map((product) => PrismaProductMapper.toDomain(product));
    } catch (error) {
      console.error("Error finding products by company:", error);
      throw new DatabaseError("Could not find products by company");
    }
  }

  /**
   * Find a product by name within a company.
   * @param name The name of the product to search for.
   * @param companyId The ID of the company.
   * @returns A promise that resolves to a Product entity or null if not found.
   */
  async findByName(name: string, companyId: string): Promise<Product | null> {
    try {
      const product = await this.client.product.findFirst({
        where: {
          name,
          companyId
        },
      });
      return product ? PrismaProductMapper.toDomain(product) : null;
    } catch (error) {
      console.error("Error finding product by name:", error);
      throw new DatabaseError("Could not find product by name");
    }
  }

  /**
   * Find products within a price range for a specific company.
   * @param minPrice The minimum price.
   * @param maxPrice The maximum price.
   * @param companyId The ID of the company.
   * @returns A promise that resolves to an array of Product entities.
   */
  async findByPriceRange(minPrice: number, maxPrice: number, companyId: string): Promise<Product[]> {
    try {
      const products = await this.client.product.findMany({
        where: {
          companyId,
          grossPrice: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      });
      return products.map((product) => PrismaProductMapper.toDomain(product));
    } catch (error) {
      console.error("Error finding products by price range:", error);
      throw new DatabaseError("Could not find products by price range");
    }
  }
}
