import ApplicationError from "@/application/core/errors/ApplicationError";

export class AlreadyMemberError extends ApplicationError {
  constructor(message: string = "User is already a member of this company") {
    super(message);
    this.name = "AlreadyMemberError";
    this.stack = new Error().stack;
    this.statusCode = 409;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}