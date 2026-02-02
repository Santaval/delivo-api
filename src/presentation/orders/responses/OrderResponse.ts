import { ClientResponse } from "@/presentation/clients/responses/ClientResponse";
import OrderItemResponse from "./OrderItemResponse";

export default interface OrderResponse {
  id: string;
  client: ClientResponse
  number: number;
  pricing: {
    subtotal: number;
    ivaTotal: number;
    total: number;
  };
  items: OrderItemResponse[];
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt?: string;
  updatedAt?: string;
}