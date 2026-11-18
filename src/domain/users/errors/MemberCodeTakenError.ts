import DomainError from "@/domain/core/errors/DomainError";

export class MemberCodeTakenError extends DomainError {
  constructor(message: string = "Member code is already taken") {
    super(message);
    this.name = "MemberCodeTakenError";
    this.stack = new Error().stack;
  }
}
