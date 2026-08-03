import ApplicationError from "@/application/core/errors/ApplicationError";

export class InvitationAlreadyExistsError extends ApplicationError {
  constructor(message: string = "A pending invitation already exists for this email") {
    super(message);
    this.name = "InvitationAlreadyExistsError";
    this.stack = new Error().stack;
    this.statusCode = 409;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}