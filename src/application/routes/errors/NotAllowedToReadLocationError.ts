import ApplicationError from "@/application/core/errors/ApplicationError";

export class NotAllowedToReadLocationError extends ApplicationError {
  constructor(message: string = "You are not allowed to see the location of this route's driver") {
    super(message);
    this.name = "NotAllowedToReadLocationError";
    this.stack = new Error().stack;
    this.statusCode = 403;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}
