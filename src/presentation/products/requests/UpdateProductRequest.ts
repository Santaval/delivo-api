export interface UpdateProductRequest {
  id: string;
  name?: string;
  netPrice?: number;
  grossPrice?: number;
  ivaRate?: number;
}
