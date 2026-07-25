import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";
import { CompanyRole, CompanyRoleType } from "@/domain/companies/valueObjects/companyRole.valueObject";
import { UserId } from "@/domain/users/valueObjects/userId.valueObject";

export class CompanyMember {
  private props: CompanyMemberProps;

  constructor(props: CompanyMemberConstructorProps) {
    this.props = {
      userId: UserId.create(props.userId),
      companyId: CompanyId.create(props.companyId),
      role: CompanyRole.create(props.role),
    };
  }

  get userId(): string { return this.props.userId.value; }
  get companyId(): string { return this.props.companyId.value; }
  get role(): CompanyRoleType { return this.props.role.value; }

  isOwner(): boolean {
    return this.props.role.isOwner();
  }

  canManageMembers(): boolean {
    return this.props.role.canManageMembers();
  }

  canRemove(target: CompanyMember): boolean {
    if (!this.canManageMembers()) return false;
    // An ADMIN cannot remove an OWNER
    if (target.isOwner() && !this.isOwner()) return false;
    return true;
  }

  canChangeRoleOf(target: CompanyMember, newRole: CompanyRoleType): boolean {
    if (!this.canManageMembers()) return false;
    // An ADMIN cannot demote an OWNER
    if (target.isOwner() && newRole !== "OWNER" && !this.isOwner()) return false;
    return true;
  }

  changeRole(newRole: CompanyRoleType): void {
    this.props.role = CompanyRole.create(newRole);
  }

  static isLastOwner(member: CompanyMember, members: CompanyMember[]): boolean {
    if (!member.isOwner()) return false;
    return members.filter((m) => m.isOwner()).length === 1;
  }
}

export interface CompanyMemberProps {
  userId: UserId;
  companyId: CompanyId;
  role: CompanyRole;
}

export interface CompanyMemberConstructorProps {
  userId: string;
  companyId: string;
  role: CompanyRoleType;
}
