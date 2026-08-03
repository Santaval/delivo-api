import { Product } from "@/domain/products/entities/Product";

export interface IProductRepository {
  all(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  find(value: string, field?: string): Promise<Product | null>;
  update(product: Product): Promise<void>;
  delete(productId: string): Promise<void>;
  findByCompanyId(companyId: string): Promise<Product[]>;
  findByName(name: string, companyId: string): Promise<Product | null>;
  findByPriceRange(minPrice: number, maxPrice: number, companyId: string): Promise<Product[]>;
  /**
   * Count active (non soft-deleted) products belonging to a company.
   * @param companyId The ID of the company.
   * @returns A promise that resolves to the number of matching products.
   */
  countByCompanyId(companyId: string): Promise<number>;
}
