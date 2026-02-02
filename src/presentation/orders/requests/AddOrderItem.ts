export default interface AddOrderItemRequest {
  orderId: string;
  productId: string;
  quantity: number;
}