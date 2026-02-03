import { Order } from "@/domain/orders";
import { RoutePointId } from "../valueObjects/routePointId.valueObject";
import { RoutePointStatus } from "../valueObjects/routePointStatus.valueObject";
import DomainError from "@/domain/core/errors/DomainError";

export class RoutePoint {
  private props: RoutePointProps;

  constructor(props: RoutePointConstructorProps) {
    this.props = {
      id: RoutePointId.create(props.id),
      status: RoutePointStatus.create(props.status),
      order: props.order,
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };
  }

  // Getters
  get id(): string {
    return this.props.id.value;
  }

  get status(): string {
    return this.props.status.value;
  }

  get order(): Order {
    return this.props.order;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  visit(): void {
    if (!this.props.status.canTransitionTo(RoutePointStatus.visited())) {
      throw new DomainError(`Cannot mark route point as visited from status: ${this.props.status.value}`);
    }

    this.props.status = RoutePointStatus.visited();
    this.props.updatedAt = new Date();
  }

  skip(): void {
    if (!this.props.status.canTransitionTo(RoutePointStatus.skipped())) {
      throw new DomainError(`Cannot skip route point from status: ${this.props.status.value}`);
    }

    this.props.status = RoutePointStatus.skipped();
    this.props.updatedAt = new Date();
  }

  markAsVisitedFromSkipped(): void {
    if (!this.props.status.isSkipped()) {
      throw new DomainError("Can only mark as visited from skipped status");
    }

    if (!this.props.status.canTransitionTo(RoutePointStatus.visited())) {
      throw new DomainError("Cannot transition to visited status");
    }

    this.props.status = RoutePointStatus.visited();
    this.props.updatedAt = new Date();
  }

  // Status checks
  isCreated(): boolean {
    return this.props.status.isCreated();
  }

  isVisited(): boolean {
    return this.props.status.isVisited();
  }

  isSkipped(): boolean {
    return this.props.status.isSkipped();
  }
}

interface RoutePointProps {
  id: RoutePointId;
  status: RoutePointStatus;
  order: Order;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutePointConstructorProps {
  id: string;
  status: string;
  order: Order;
  createdAt?: string;
  updatedAt?: string;
}
