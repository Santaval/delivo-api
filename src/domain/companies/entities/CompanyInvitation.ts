import DomainError from "@/domain/core/errors/DomainError";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { CompanyRole, CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";
import { InvitationId } from "@/domain/companies/valueObjects/invitationId.valueObject";
import { InvitationStatus, InvitationStatusType } from "@/domain/companies/valueObjects/invitationStatus.valueObject";
import { InvitationToken } from "@/domain/companies/valueObjects/invitationToken.valueObject";
import { Email } from "@/domain/users/valueObjects/email.valueObject";
import { UserId } from "@/domain/users/valueObjects/userId.valueObject";

export class CompanyInvitation {
  private props: CompanyInvitationProps;

  constructor(props: CompanyInvitationConstructorProps) {
    this.props = {
      id: InvitationId.create(props.id),
      email: Email.create(props.email),
      role: CompanyRole.create(props.role),
      status: InvitationStatus.create(props.status),
      token: InvitationToken.create(props.token),
      expiresAt: new Date(props.expiresAt),
      companyId: CompanyId.create(props.companyId),
      invitedById: UserId.create(props.invitedById),
      createdAt: props.createdAt ? new Date(props.createdAt) : new Date(),
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : new Date(),
    };
  }

  get id(): string { return this.props.id.value; }
  get email(): string { return this.props.email.value; }
  get role(): CompanyRoleType { return this.props.role.value; }
  get status(): InvitationStatusType { return this.props.status.value; }
  get token(): string { return this.props.token.value; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get companyId(): string { return this.props.companyId.value; }
  get invitedById(): string { return this.props.invitedById.value; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  isPending(): boolean {
    return this.props.status.isPending();
  }

  isExpired(): boolean {
    return Date.now() > this.props.expiresAt.getTime();
  }

  accept(): void {
    if (!this.isPending()) {
      throw new DomainError(`Cannot accept an invitation with status ${this.props.status}`);
    }
    if (this.isExpired()) {
      this.props.status = InvitationStatus.expired();
      throw new DomainError("Cannot accept an expired invitation");
    }
    this.props.status = InvitationStatus.accepted();
  }

  revoke(): void {
    if (!this.isPending()) {
      throw new DomainError(`Cannot revoke an invitation with status ${this.props.status}`);
    }
    this.props.status = InvitationStatus.revoked();
  }
}

export interface CompanyInvitationProps {
  id: InvitationId;
  email: Email;
  role: CompanyRole;
  status: InvitationStatus;
  token: InvitationToken;
  expiresAt: Date;
  companyId: CompanyId;
  invitedById: UserId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyInvitationConstructorProps {
  id: string;
  email: string;
  role: CompanyRoleType;
  status: InvitationStatusType;
  token: string;
  expiresAt: string;
  companyId: string;
  invitedById: string;
  createdAt?: string;
  updatedAt?: string;
}
