export interface ProductResponse {
  id: string;
  name: string;
  pricing: {
    netPrice: number;
    ivaRate: number;
    ivaAmount: number;
    totalPrice: number;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
