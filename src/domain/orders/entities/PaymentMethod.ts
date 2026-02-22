import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { PaymentMethodId } from "../valueObjects/paymentMethodId.valueObject";
import PaymentMethodName from "../valueObjects/paymentMethodName";

export default class PaymentMethod {
  private props: PaymentMethodProps;

  constructor(props: ConstructorProps) {
    this.props = {
      id: PaymentMethodId.create(props.id),
      name: PaymentMethodName.create(props.name),
      companyId: CompanyId.create(props.companyId),
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

  get companyId(): string {
    return this.props.companyId.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

interface PaymentMethodProps {
  id: PaymentMethodId;
  name: PaymentMethodName;
  companyId: CompanyId;
  createdAt: Date;
  updatedAt: Date;
  
}

export interface ConstructorProps {
  id: string;
  name: string;
  companyId: string,
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
