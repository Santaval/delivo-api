import ApplicationError from "@/application/core/errors/ApplicationError";

export class NotAllowedToManageMembersError extends ApplicationError {
  constructor(message: string = "You are not allowed to manage members of this company") {
    super(message);
    this.name = "NotAllowedToManageMembersError";
    this.stack = new Error().stack;
    this.statusCode = 403;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}