import { ProductResponse } from "@/presentation/products/responses/ProductResponse";

export default interface OrderItemResponse extends ProductResponse {
  quantity: number;
  productId: string;
}