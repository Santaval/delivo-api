import { Order } from "@/domain/orders";
import { RoutePointId } from "../valueObjects/routePointId.valueObject";
import { RoutePointStatus } from "../valueObjects/routePointStatus.valueObject";
import { RouteId } from "../valueObjects/routeId.valueObject";

export class RoutePoint {
  private props: RoutePointProps;

  constructor(props: RoutePointConstructorProps) {
    this.props = {
      id: RoutePointId.create(props.id),
      status: RoutePointStatus.create(props.status),
      order: props.order,
      index: props.index,
      polyline: props.polyline,
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

  get index(): number | null {
    return this.props.index;
  }

  get polyline(): string | null {
    return this.props.polyline;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get routeId(): string {
    return this.props.routeId.value;
  }

  setIndex(index: number): void {
    this.props.index = index;
  }
}

interface RoutePointProps {
  id: RoutePointId;
  status: RoutePointStatus;
  order: Order;
  index: number | null;
  polyline: string | null;
  routeId: RouteId;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoutePointConstructorProps {
  id: string;
  status: string;
  index: number | null;
  order: Order;
  polyline: string | null;
  routeId: string;
  createdAt?: string;
  updatedAt?: string;
}
