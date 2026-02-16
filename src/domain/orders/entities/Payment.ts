import moment, { Moment } from "moment";
import { PaymentAmount } from "../valueObjects/paymentAmount.valueObject";
import PaymentMethod from "./PaymentMethod";
import { OrderId } from "../valueObjects/orderId.valueObject";

export default class Payment {
  private props: PaymentProps;

  constructor(props: ConstructorProps) {
    this.props = {
      orderId: OrderId.create(props.orderId),
      amount: PaymentAmount.create(props.amount),
      method: props.method,
      createdAt: moment(props.createdAt),
      updatedAt: moment(props.updatedAt)
    }
  }

  get amount(): PaymentAmount {return this.props.amount}
  get method(): PaymentMethod {return this.props.method}
  get orderId(): OrderId {return this.props.orderId}
  get createdAt(): Moment {return this.props.createdAt}
  get updatedAt(): Moment {return this.props.updatedAt}

}


interface PaymentProps {
  method: PaymentMethod,
  amount: PaymentAmount,
  orderId: OrderId,
  createdAt: Moment,
  updatedAt: Moment
}

interface ConstructorProps {
  method: PaymentMethod,
  amount: number,
  createdAt: string,
  updatedAt: string,
  orderId: string
}