import { OrderItem, Order } from "@/domain/orders";
import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import IOrderPricingCalculator from "@/domain/orders/services/IOrderPricingCalculator";
import { IProductRepository } from "@/domain/products/repositories/IProductRepository";

export default class OrderPricingCalculator implements IOrderPricingCalculator {

  constructor(
    private readonly ordersRepository: IOrderRepository,
    private readonly productsRepository: IProductRepository
  ) {}

  /**
   *  Calculate the new total price, iva amount, etc on the order after adding an item.
   * @param item
   * @returns The updated order
   */
  async onAddItem(item: OrderItem): Promise<Order> {
    const order = await this.ordersRepository.findById(item.billId);
    if (!order) throw new Error("Order not found");

    const product = await this.productsRepository.find(item.id);
    if (!product) throw new Error("Product not found");

    const itemGrossPrice = product.pricing.grossPrice * item.quantity;
    const itemIvaAmount = itemGrossPrice * (product.pricing.ivaRate / 100);
    const subtotal = itemGrossPrice - itemIvaAmount;

    const newSubtotal = order.subtotal + subtotal;
    const newIvaTotal = order.ivaTotal + itemIvaAmount;
    order.setTotals(newSubtotal, newIvaTotal, order.paid);

    return order;
  }

  /**
   *  Calculate the new total price, iva amount, etc on the order after removing an item.
   * @param item
   * @returns The updated order
   */
  async onRemoveItem(item: OrderItem): Promise<Order> {
    const order = await this.ordersRepository.findById(item.billId);
    if (!order) throw new Error("Order not found");

    const product = await this.productsRepository.find(item.id);
    if (!product) throw new Error("Product not found");

    const itemGrossPrice = product.pricing.grossPrice * item.quantity;
    const itemIvaAmount = itemGrossPrice * (product.pricing.ivaRate / 100);
    const subtotal = itemGrossPrice - itemIvaAmount;

    const newSubtotal = order.subtotal - subtotal;
    const newIvaTotal = order.ivaTotal - itemIvaAmount;
    const newDue = (newSubtotal + newIvaTotal) ;
    order.setTotals(newSubtotal, newIvaTotal, newDue);

    return order;
  }
}