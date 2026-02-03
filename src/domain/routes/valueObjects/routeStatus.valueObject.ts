import DomainError from "@/domain/core/errors/DomainError";

export type RouteStatusType = "CREATED" | "STARTED" | "COMPLETED";

export class RouteStatus {
  private readonly _value: RouteStatusType;

  private constructor(value: RouteStatusType) {
    this._value = value;
  }

  static create(value: string): RouteStatus {
    const validStatuses: RouteStatusType[] = ["CREATED", "STARTED", "COMPLETED"];
    
    if (!validStatuses.includes(value as RouteStatusType)) {
      throw new DomainError(`Invalid route status: ${value}. Valid statuses are: ${validStatuses.join(", ")}`);
    }

    return new RouteStatus(value as RouteStatusType);
  }

  static created(): RouteStatus {
    return new RouteStatus("CREATED");
  }

  static started(): RouteStatus {
    return new RouteStatus("STARTED");
  }

  static completed(): RouteStatus {
    return new RouteStatus("COMPLETED");
  }

  get value(): RouteStatusType {
    return this._value;
  }

  isCreated(): boolean {
    return this._value === "CREATED";
  }

  isStarted(): boolean {
    return this._value === "STARTED";
  }

  isCompleted(): boolean {
    return this._value === "COMPLETED";
  }

  canTransitionTo(newStatus: RouteStatus): boolean {
    // Define business rules for status transitions
    switch (this._value) {
      case "CREATED":
        return newStatus._value === "STARTED";
      case "STARTED":
        return newStatus._value === "COMPLETED";
      case "COMPLETED":
        return false; // Completed routes cannot be changed
      default:
        return false;
    }
  }

  equals(other: RouteStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
