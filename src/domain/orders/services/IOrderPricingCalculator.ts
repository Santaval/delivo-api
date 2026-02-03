import Order from "../entities/Order";
import OrderItem from "../entities/OrderItem";

export default interface IOrderPricingCalculator {
  onAddItem(item: OrderItem): Promise<Order>;
  onRemoveItem(item: OrderItem): Promise<Order>;
}
