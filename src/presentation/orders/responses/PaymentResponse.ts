export default interface PaymentResponse {
  id: string;
  orderId: string;
  amount: number;
  method: {
    id: string;
    companyId: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}
