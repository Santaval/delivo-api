import DomainError from "@/domain/core/errors/DomainError";

export class RouteId {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): RouteId {
    if (!value || value.trim().length === 0) {
      throw new DomainError("RouteId cannot be empty");
    }
    return new RouteId(value);
  }

  get value(): string {
    return this._value;
  }

  equals(other: RouteId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
