import IPaymentRepository from "@/domain/orders/repositories/IPaymentRepository";
import IOrderPaymentsService from "../interfaces/IOrderPaymentsService";
import Payment from "@/domain/orders/entities/Payment";
import { PaymentId } from "@/domain/orders/valueObjects/paymentId.valueObject";
import IOrderRepository from "@/domain/orders/repositories/IOrderRepository";
import ApplicationError from "@/application/core/errors/ApplicationError";
import { Order } from "@/domain/orders";

export default class OrderPaymentsService implements IOrderPaymentsService {
  constructor(
    private readonly paymentsRepository: IPaymentRepository,
    private readonly ordersRepository: IOrderRepository
  ) {}

  async add(payment: Payment): Promise<Payment> {
    const order = await this.ordersRepository.findById(payment.orderId.value);
    if (!order) throw new ApplicationError("Order not found");

    const newPaidValue = this.calcNewOrderPaidValue(order, payment);
    if (newPaidValue > order.total) throw new ApplicationError("Payment exceeds order total");
    order.setPaid(newPaidValue);

    if (order.paid >= order.total) {
      order.setStatus("PAID");
    }

    await this.ordersRepository.update(order);
    return this.paymentsRepository.add(payment);
  }

  async delete(paymentId: PaymentId): Promise<void> {
    throw new ApplicationError("Method not implemented");
  }

  private calcNewOrderPaidValue(order: Order, payment: Payment): number {
    const totalPaid = order.paid + payment.amount.value;
    return totalPaid;
  }
}