import { RouteId } from "../valueObjects/routeId.valueObject";
import { RouteName } from "../valueObjects/routeName.valueObject";
import { RouteStatus } from "../valueObjects/routeStatus.valueObject";
import { RoutePoint } from "./RoutePoint";

export class Route {
  private props: RouteProps;

  constructor(props: RouteConstructorProps) {
    this.props = {
      id: RouteId.create(props.id),
      name: RouteName.create(props.name),
      status: RouteStatus.create(props.status),
      points: props.points || [],
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

  get status(): string {
    return this.props.status.value;
  }

  get points(): RoutePoint[] {
    return [...this.props.points]; // Return copy to maintain immutability
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}

interface RouteProps {
  id: RouteId;
  name: RouteName;
  status: RouteStatus;
  points: RoutePoint[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteConstructorProps {
  id: string;
  name: string;
  status: string;
  points?: RoutePoint[];
  createdAt?: string;
  updatedAt?: string;
}