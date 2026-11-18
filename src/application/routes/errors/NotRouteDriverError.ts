import ApplicationError from "@/application/core/errors/ApplicationError";

export class NotRouteDriverError extends ApplicationError {
  constructor(message: string = "Only the route's driver can report its location") {
    super(message);
    this.name = "NotRouteDriverError";
    this.stack = new Error().stack;
    this.statusCode = 403;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}
