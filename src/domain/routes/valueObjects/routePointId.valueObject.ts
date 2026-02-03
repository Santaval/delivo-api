import DomainError from "@/domain/core/errors/DomainError";

export class RoutePointId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): RoutePointId {
    if (!value || value.trim().length === 0) {
      throw new DomainError("RoutePointId cannot be empty");
    }
    return new RoutePointId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: RoutePointId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
