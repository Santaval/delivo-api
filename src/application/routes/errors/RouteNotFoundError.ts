import ApplicationError from "@/application/core/errors/ApplicationError";

export class RouteNotFoundError extends ApplicationError {
  constructor(message: string = "Route not found") {
    super(message);
    this.name = "RouteNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}
