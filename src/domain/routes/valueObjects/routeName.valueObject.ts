import DomainError from "@/domain/core/errors/DomainError";

export class RouteName {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): RouteName {
    if (!value || value.trim().length === 0) {
      throw new DomainError("Route name cannot be empty");
    }

    const trimmedValue = value.trim();
    
    if (trimmedValue.length < 2) {
      throw new DomainError("Route name must be at least 2 characters long");
    }

    if (trimmedValue.length > 100) {
      throw new DomainError("Route name cannot be longer than 100 characters");
    }

    return new RouteName(trimmedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: RouteName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
