import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { RouteId } from "../valueObjects/routeId.valueObject";
import { RouteName } from "../valueObjects/routeName.valueObject";
import { RouteStatus, RouteStatusType } from "../valueObjects/routeStatus.valueObject";
import { UserId } from "@/domain/users/valueObjects/userId.valueObject";
import { RoutePoint } from "./RoutePoint";
import { DriverLocation } from "../valueObjects/driverLocation.valueObject";

/** Read-model of the user assigned to a route (populated by the repository). */
export interface RouteDriver {
  id: string;
  name: string;
  surnames: string;
  email: string;
}

export class Route {
  private props: RouteProps;

  constructor(props: RouteConstructorProps) {
    this.props = {
      id: RouteId.create(props.id),
      name: RouteName.create(props.name),
      status: RouteStatus.create(props.status),
      polyline: props.polyline || null,
      points: props.points || [],
      companyId: CompanyId.create(props.companyId),
      driverId: props.driverId ? UserId.create(props.driverId) : null,
      driver: props.driver ?? null,
      driverLocation: props.driverLocation ?? null,
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

  get companyId(): string {
    return this.props.companyId.value;
  }

  get driverId(): string | null {
    return this.props.driverId ? this.props.driverId.value : null;
  }

  get driver(): RouteDriver | null {
    return this.props.driver;
  }

  /** Read-model: latest known driver location (populated by the repository). */
  get driverLocation(): DriverLocation | null {
    return this.props.driverLocation;
  }

  get polyline(): string | null {
    return this.props.polyline;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  setPolyline(polyline: string | null): void {
    this.props.polyline = polyline;
  }

  assignDriver(driverId: string | null): void {
    const newDriverId = driverId ? UserId.create(driverId) : null;
    if (newDriverId?.value !== this.driverId) {
      // the read-model no longer matches the new driver; it is re-populated on the next read
      this.props.driver = null;
    }
    this.props.driverId = newDriverId;
  }

  setStatus(status: RouteStatusType): void {
    this.props.status = RouteStatus.create(status);
  }

}

interface RouteProps {
  id: RouteId;
  name: RouteName;
  status: RouteStatus;
  points: RoutePoint[];
  companyId: CompanyId;
  polyline: string | null;
  driverId: UserId | null;
  driver: RouteDriver | null;
  driverLocation: DriverLocation | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteConstructorProps {
  id: string;
  name: string;
  status: string;
  companyId: string;
  polyline: string | null;
  driverId?: string | null;
  driver?: RouteDriver | null;
  driverLocation?: DriverLocation | null;
  points?: RoutePoint[];
  createdAt?: string;
  updatedAt?: string;
}