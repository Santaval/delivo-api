import ApplicationError from "@/application/core/errors/ApplicationError";

export class CannotRemoveLastOwnerError extends ApplicationError {
  constructor(message: string = "Cannot remove the last owner of the company") {
    super(message);
    this.name = "CannotRemoveLastOwnerError";
    this.stack = new Error().stack;
    this.statusCode = 409;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}