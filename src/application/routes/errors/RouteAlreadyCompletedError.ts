import ApplicationError from "@/application/core/errors/ApplicationError";

export class RouteAlreadyCompletedError extends ApplicationError {
  constructor(message: string = "A completed route cannot change its driver") {
    super(message);
    this.name = "RouteAlreadyCompletedError";
    this.stack = new Error().stack;
    this.statusCode = 409;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}
