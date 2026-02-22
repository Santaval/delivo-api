import Payment from "../entities/Payment";
import { PaymentId } from "../valueObjects/paymentId.valueObject";

export default interface IPaymentRepository {
  add(payment: Payment): Promise<Payment>;
  delete(paymentId: PaymentId): Promise<void>;
}