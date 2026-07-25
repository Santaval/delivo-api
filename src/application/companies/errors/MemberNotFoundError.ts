import ApplicationError from "@/application/core/errors/ApplicationError";

export class MemberNotFoundError extends ApplicationError {
  constructor(message: string = "User is not a member of this company") {
    super(message);
    this.name = "MemberNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}