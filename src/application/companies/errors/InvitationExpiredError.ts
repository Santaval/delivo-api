import ApplicationError from "@/application/core/errors/ApplicationError";

export class InvitationExpiredError extends ApplicationError {
  constructor(message: string = "Invitation has expired") {
    super(message);
    this.name = "InvitationExpiredError";
    this.stack = new Error().stack;
    this.statusCode = 410;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}