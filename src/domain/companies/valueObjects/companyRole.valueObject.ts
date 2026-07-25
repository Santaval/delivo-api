import DomainError from "@/domain/core/errors/DomainError";

export type CompanyRoleType = "OWNER" | "ADMIN" | "DEALER";

export class CompanyRole {
  private readonly _value: CompanyRoleType;

  private constructor(value: CompanyRoleType) {
    this._value = value;
  }

  static create(value: string): CompanyRole {
    const validRoles: CompanyRoleType[] = ["OWNER", "ADMIN", "DEALER"];

    if (!validRoles.includes(value as CompanyRoleType)) {
      throw new DomainError(`Invalid company role: ${value}. Valid roles are: ${validRoles.join(", ")}`);
    }

    return new CompanyRole(value as CompanyRoleType);
  }

  static owner(): CompanyRole {
    return new CompanyRole("OWNER");
  }

  static admin(): CompanyRole {
    return new CompanyRole("ADMIN");
  }

  static dealer(): CompanyRole {
    return new CompanyRole("DEALER");
  }

  get value(): CompanyRoleType {
    return this._value;
  }

  isOwner(): boolean {
    return this._value === "OWNER";
  }

  isAdmin(): boolean {
    return this._value === "ADMIN";
  }

  isDealer(): boolean {
    return this._value === "DEALER";
  }

  canManageMembers(): boolean {
    return this._value === "OWNER" || this._value === "ADMIN";
  }

  equals(other: CompanyRole): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
