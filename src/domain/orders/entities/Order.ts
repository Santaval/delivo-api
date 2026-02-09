import OrderItem from "./OrderItem";
import { OrderId } from "../valueObjects/orderId.valueObject";
import { OrderNumber } from "../valueObjects/orderNumber.valueObject";
import { OrderStatus, OrderStatusType } from "../valueObjects/orderStatus.valueObject";
import { OrderTotal } from "../valueObjects/orderTotal.valueObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import DomainError from "@/domain/core/errors/DomainError";
import { Client } from "@/domain/clients/entities/Client";
import { OrderDeliveryStatus, OrderDeliveryStatusType } from "../valueObjects/orderDeliveryStatus";

export default class Order {
  private props: OrderProps;

  constructor(props: ConstructorProps) {
    this.props = {
      id: OrderId.create(props.id),
      client: props.client,
      number: OrderNumber.create(props.number),
      totals: OrderTotal.create(props.subtotal, props.ivaTotal),
      companyId: CompanyId.create(props.companyId),
      items: props.items || [],
      status: OrderStatus.create(props.status),
      deliveryStatus: OrderDeliveryStatus.create(props.deliveryStatus),
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };

  }

  // Getters
  get id(): string {
    return this.props.id.value;
  }

  get client() {
    return this.props.client;
  }

  get number(): number {
    return this.props.number.value;
  }

  get subtotal(): number {
    return this.props.totals.subtotal;
  }

  get ivaTotal(): number {
    return this.props.totals.ivaTotal;
  }

  get total(): number {
    return this.props.totals.total;
  }

  get companyId(): string {
    return this.props.companyId.value;
  }

  get items(): OrderItem[] {
    return [...this.props.items]; // Return copy to maintain immutability
  }

  get status(): string {
    return this.props.status.value;
  }

  get deliveryStatus(): string {
    return this.props.deliveryStatus.value;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  setTotals(subtotal: number, ivaTotal: number): void {
    this.props.totals = OrderTotal.create(subtotal, ivaTotal);
  }


}

interface OrderProps {
  id: OrderId;
  client: Client
  number: OrderNumber;
  totals: OrderTotal;
  companyId: CompanyId;
  items: OrderItem[];
  status: OrderStatus;
  deliveryStatus: OrderDeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConstructorProps {
  id: string;
  client: Client
  number: number;
  subtotal: number;
  ivaTotal: number;
  total: number;
  companyId: string;
  items: OrderItem[];
  status: OrderStatusType;
  deliveryStatus: OrderDeliveryStatusType;
  createdAt?: string;
  updatedAt?: string;
}
