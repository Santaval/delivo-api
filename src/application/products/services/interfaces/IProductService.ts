/* eslint-disable @typescript-eslint/no-explicit-any */
import { Product } from "@/domain/products/entities/Product";

export interface IProductService {
  create(product: Product): Promise<Product>;
  find(value: any, field?: string): Promise<Product | null>;
  update(product: Product): Promise<Product>;
  delete(productId: string): Promise<void>;
  findAll(): Promise<Product[]>;
  findByCompanyId(companyId: string): Promise<Product[]>;
  findByName(name: string, companyId: string): Promise<Product | null>;
  findByPriceRange(minPrice: number, maxPrice: number, companyId: string): Promise<Product[]>;
}
