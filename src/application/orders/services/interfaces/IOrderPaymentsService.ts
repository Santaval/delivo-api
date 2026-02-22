import Payment from "@/domain/orders/entities/Payment";
import { PaymentId } from "@/domain/orders/valueObjects/paymentId.valueObject";

export default interface IOrderPaymentsService {
  add(payment: Payment): Promise<Payment>;
  delete(paymentId: PaymentId): Promise<void>;
}