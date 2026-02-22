import Payment from "@/domain/orders/entities/Payment";
import AddPaymentRequest from "../requests/AddPayment";
import PaymentMethod from "@/domain/orders/entities/PaymentMethod";
import PaymentResponse from "../responses/PaymentResponse";

export default class PaymentMapper {
  static fromAddToDomain(paymentDto: AddPaymentRequest, orderId: string): Payment {
    return new Payment({
      id: "to-be-filled",
      orderId: orderId,
      amount: paymentDto.amount,
      method: new PaymentMethod({
        id: paymentDto.methodId,
        companyId: "to-be-filled",
        name: "to-be-filled",
      }),
      createdAt: new Date().toString(),
      updatedAt: new Date().toString()
    });
  }

  static toResponse(payment: Payment): PaymentResponse {
    return {
      id: payment.id.value,
      orderId: payment.orderId.value,
      amount: payment.amount.value,
      method: {
        id: payment.method.id,
        companyId: payment.method.companyId,
        name: payment.method.name,
      },
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }
}
