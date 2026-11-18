import ApplicationError from "@/application/core/errors/ApplicationError";

export class InvalidRouteDriverError extends ApplicationError {
  constructor(message: string = "El repartidor debe ser miembro de la empresa") {
    super(message);
    this.name = "InvalidRouteDriverError";
    this.stack = new Error().stack;
    this.statusCode = 422;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}
