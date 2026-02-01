import OrderItem from "./OrderItem";
import { OrderId } from "../valueObjects/orderId.valueObject";
import { OrderNumber } from "../valueObjects/orderNumber.valueObject";
import { OrderStatus } from "../valueObjects/orderStatus.valueObject";
import { OrderTotal } from "../valueObjects/orderTotal.valueObject";
import { ClientId } from "@/domain/clients/valueObjects/clientId.valueObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import DomainError from "@/domain/core/errors/DomainError";

export default class Order {
  private props: OrderProps;

  constructor(props: ConstructorProps) {
    this.props = {
      id: OrderId.create(props.id),
      clientId: ClientId.create(props.clientId),
      number: OrderNumber.create(props.number),
      totals: OrderTotal.create(props.subtotal, props.ivaTotal),
      companyId: CompanyId.create(props.companyId),
      items: props.items || [],
      status: OrderStatus.create(props.status),
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };

    this.validate();
  }

  private validate(): void {
    if (this.props.items.length === 0) {
      throw new DomainError("Order must have at least one item");
    }

    // Validate that totals match item totals
    const calculatedTotals = this.calculateTotalsFromItems();
    if (!calculatedTotals.equals(this.props.totals)) {
      throw new DomainError("Order totals do not match item totals");
    }
  }

  private calculateTotalsFromItems(): OrderTotal {
    let subtotal = 0;
    let ivaTotal = 0;

    for (const item of this.props.items) {
      const itemSubtotal = item.pricing.netPrice * item.quantity;
      const itemIva = item.pricing.ivaAmount * item.quantity;
      
      subtotal += itemSubtotal;
      ivaTotal += itemIva;
    }

    return OrderTotal.create(
      Math.round(subtotal * 100) / 100,
      Math.round(ivaTotal * 100) / 100
    );
  }

  // Getters
  get id(): string {
    return this.props.id.value;
  }

  get clientId(): string {
    return this.props.clientId.value;
  }

  get number(): string {
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  addItem(item: OrderItem): void {
    this.props.items.push(item);
    this.updateTotals();
    this.props.updatedAt = new Date();
  }

  removeItem(itemIndex: number): void {
    if (itemIndex < 0 || itemIndex >= this.props.items.length) {
      throw new DomainError("Invalid item index");
    }

    this.props.items.splice(itemIndex, 1);
    
    if (this.props.items.length === 0) {
      throw new DomainError("Order must have at least one item");
    }

    this.updateTotals();
    this.props.updatedAt = new Date();
  }

  updateItemQuantity(itemIndex: number, newQuantity: number): void {
    if (itemIndex < 0 || itemIndex >= this.props.items.length) {
      throw new DomainError("Invalid item index");
    }

    if (newQuantity <= 0) {
      throw new DomainError("Item quantity must be positive");
    }

    // Since OrderItem extends Product and quantity is private, 
    // we would need to create a new OrderItem with the new quantity
    // This depends on your OrderItem implementation
    this.updateTotals();
    this.props.updatedAt = new Date();
  }

  changeStatus(newStatus: string): void {
    const newOrderStatus = OrderStatus.create(newStatus);
    
    if (!this.props.status.canTransitionTo(newOrderStatus)) {
      throw new DomainError(`Cannot transition from ${this.props.status.value} to ${newStatus}`);
    }

    this.props.status = newOrderStatus;
    this.props.updatedAt = new Date();
  }

  markAsPaid(): void {
    this.changeStatus("PAID");
  }

  cancel(): void {
    this.changeStatus("CANCELLED");
  }

  private updateTotals(): void {
    this.props.totals = this.calculateTotalsFromItems();
  }

  // Status checks
  isPending(): boolean {
    return this.props.status.isPending();
  }

  isPaid(): boolean {
    return this.props.status.isPaid();
  }

  isCancelled(): boolean {
    return this.props.status.isCancelled();
  }
}

interface OrderProps {
  id: OrderId;
  clientId: ClientId;
  number: OrderNumber;
  totals: OrderTotal;
  companyId: CompanyId;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConstructorProps {
  id: string;
  clientId: string;
  number: string;
  subtotal: number;
  ivaTotal: number;
  total: number;
  companyId: string;
  items: OrderItem[];
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt?: string;
  updatedAt?: string;
}
