import { PaymentMethodId } from "../valueObjects/paymentMethodId.valueObject";
import PaymentMethodName from "../valueObjects/paymentMethodName";

export default class Order {
  private props: OrderProps;

  constructor(props: ConstructorProps) {
    this.props = {
      id: PaymentMethodId.create(props.id),
      name: PaymentMethodName.create(props.name),
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };

  }

  // Getters
  get id(): string {
    return this.props.id.value;
  }

  get name(): string {
    return this.props.name.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

interface OrderProps {
  id: PaymentMethodId;
  name: PaymentMethodName;
  createdAt: Date;
  updatedAt: Date;
  
}

export interface ConstructorProps {
  id: string;
  name: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
