import { Order } from "@/domain/orders";
import { RoutePointId } from "../valueObjects/routePointId.valueObject";
import { RoutePointStatus } from "../valueObjects/routePointStatus.valueObject";
import DomainError from "@/domain/core/errors/DomainError";
import { RouteId } from "../valueObjects/routeId.valueObject";

export class RoutePoint {
  private props: RoutePointProps;

  constructor(props: RoutePointConstructorProps) {
    this.props = {
      id: RoutePointId.create(props.id),
      status: RoutePointStatus.create(props.status),
      order: props.order,
      routeId: RouteId.create(props.routeId),
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

  get routeId(): string {
    return this.props.routeId.value;
  }
}

interface RoutePointProps {
  id: RoutePointId;
  status: RoutePointStatus;
  order: Order;
  routeId: RouteId;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutePointConstructorProps {
  id: string;
  status: string;
  order: Order;
  routeId: string;
  createdAt?: string;
  updatedAt?: string;
}
