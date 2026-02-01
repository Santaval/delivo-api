export interface CreateProductRequest {
  name: string;
  netPrice: number;
  grossPrice: number;
  ivaRate?: number;
  companyId: string;
}
