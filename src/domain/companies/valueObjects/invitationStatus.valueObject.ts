import DomainError from "@/domain/core/errors/DomainError";

export type InvitationStatusType = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";

export class InvitationStatus {
  private readonly _value: InvitationStatusType;

  private constructor(value: InvitationStatusType) {
    this._value = value;
  }

  static create(value: string): InvitationStatus {
    const validStatuses: InvitationStatusType[] = ["PENDING", "ACCEPTED", "REVOKED", "EXPIRED"];

    if (!validStatuses.includes(value as InvitationStatusType)) {
      throw new DomainError(`Invalid invitation status: ${value}. Valid statuses are: ${validStatuses.join(", ")}`);
    }

    return new InvitationStatus(value as InvitationStatusType);
  }

  static pending(): InvitationStatus {
    return new InvitationStatus("PENDING");
  }

  static accepted(): InvitationStatus {
    return new InvitationStatus("ACCEPTED");
  }

  static revoked(): InvitationStatus {
    return new InvitationStatus("REVOKED");
  }

  static expired(): InvitationStatus {
    return new InvitationStatus("EXPIRED");
  }

  get value(): InvitationStatusType {
    return this._value;
  }

  isPending(): boolean {
    return this._value === "PENDING";
  }

  isAccepted(): boolean {
    return this._value === "ACCEPTED";
  }

  isRevoked(): boolean {
    return this._value === "REVOKED";
  }

  isExpired(): boolean {
    return this._value === "EXPIRED";
  }

  canTransitionTo(newStatus: InvitationStatus): boolean {
    // Only pending invitations can change; all other states are final
    switch (this._value) {
      case "PENDING":
        return newStatus._value === "ACCEPTED" || newStatus._value === "REVOKED" || newStatus._value === "EXPIRED";
      case "ACCEPTED":
        return false; // Accepted invitations cannot be changed
      case "REVOKED":
        return false; // Revoked invitations cannot be changed
      case "EXPIRED":
        return false; // Expired invitations cannot be changed
      default:
        return false;
    }
  }

  equals(other: InvitationStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
