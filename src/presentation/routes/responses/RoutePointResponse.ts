import OrderResponse from "@/presentation/orders/responses/OrderResponse";

export default interface RoutePointResponse {
    id: string;
    status: string;
    order: OrderResponse;
    routeId: string;
    createdAt?: string;
    updatedAt?: string;
}