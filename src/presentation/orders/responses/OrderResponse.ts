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
  paid: number;
  items: OrderItemResponse[];
  status: "PENDING" | "PAID" | "CANCELLED";
  deliveryStatus: "PENDING" | "ON_ROUTE" | "IN_TRANSIT" | "DELIVERED" | "RETURNED";
  route?: { id: string; name: string; status: "CREATED" | "STARTED" | "COMPLETED" } | null;
  createdAt?: string;
  updatedAt?: string;
}