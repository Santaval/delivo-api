import ApplicationError from "@/application/core/errors/ApplicationError";

export class RouteNotStartedError extends ApplicationError {
  constructor(message: string = "The route is not in progress") {
    super(message);
    this.name = "RouteNotStartedError";
    this.stack = new Error().stack;
    this.statusCode = 409;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}
