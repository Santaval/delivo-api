export interface CreateProductRequest {
  name: string;
  netPrice: number;
  ivaRate?: number;
  companyId: string;
}
