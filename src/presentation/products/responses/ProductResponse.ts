export interface ProductResponse {
  id: string;
  name: string;
  pricing: {
    netPrice: number;
    ivaRate: number;
    ivaAmount: number;
    totalPrice: number;
  };
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
