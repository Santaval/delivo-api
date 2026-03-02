import { Order } from "@/domain/orders";

export default interface IOrderItemsManager {
  addItem(productId: string, quantity: number, orderId: string): Promise<Order>;
  removeItem(orderId: string, itemId: string): Promise<Order>;
}
