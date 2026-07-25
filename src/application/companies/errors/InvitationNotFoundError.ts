import ApplicationError from "@/application/core/errors/ApplicationError";

export class InvitationNotFoundError extends ApplicationError {
  constructor(message: string = "Invitation not found") {
    super(message);
    this.name = "InvitationNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}