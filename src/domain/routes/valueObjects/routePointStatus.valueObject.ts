import DomainError from "@/domain/core/errors/DomainError";

export type RoutePointStatusType = "CREATED" | "VISITED" | "SKIPPED";

export class RoutePointStatus {
  private readonly _value: RoutePointStatusType;

  private constructor(value: RoutePointStatusType) {
    this._value = value;
  }

  static create(value: string): RoutePointStatus {
    const validStatuses: RoutePointStatusType[] = ["CREATED", "VISITED", "SKIPPED"];
    
    if (!validStatuses.includes(value as RoutePointStatusType)) {
      throw new DomainError(`Invalid route point status: ${value}. Valid statuses are: ${validStatuses.join(", ")}`);
    }

    return new RoutePointStatus(value as RoutePointStatusType);
  }

  static created(): RoutePointStatus {
    return new RoutePointStatus("CREATED");
  }

  static visited(): RoutePointStatus {
    return new RoutePointStatus("VISITED");
  }

  static skipped(): RoutePointStatus {
    return new RoutePointStatus("SKIPPED");
  }

  get value(): RoutePointStatusType {
    return this._value;
  }

  isCreated(): boolean {
    return this._value === "CREATED";
  }

  isVisited(): boolean {
    return this._value === "VISITED";
  }

  isSkipped(): boolean {
    return this._value === "SKIPPED";
  }

  canTransitionTo(newStatus: RoutePointStatus): boolean {
    // Define business rules for status transitions
    switch (this._value) {
      case "CREATED":
        return newStatus._value === "VISITED" || newStatus._value === "SKIPPED";
      case "VISITED":
        return false; // Visited points cannot be changed
      case "SKIPPED":
        return newStatus._value === "VISITED"; // Skipped can be visited later
      default:
        return false;
    }
  }

  equals(other: RoutePointStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
