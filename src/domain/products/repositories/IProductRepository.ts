import { Product } from "@/domain/products/entities/Product";

export interface IProductRepository {
  all(): Promise<Product[]>;
  create(product: Product): Promise<void>;
  find(value: string, field?: string): Promise<Product | null>;
  update(product: Product): Promise<void>;
  delete(productId: string): Promise<void>;
  findByCompanyId(companyId: string): Promise<Product[]>;
  findByName(name: string, companyId: string): Promise<Product | null>;
  findByPriceRange(minPrice: number, maxPrice: number, companyId: string): Promise<Product[]>;
}
