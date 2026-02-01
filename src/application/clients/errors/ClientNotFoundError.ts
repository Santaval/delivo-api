import ApplicationError from "@/application/core/errors/ApplicationError";

export class ClientNotFoundError extends ApplicationError {
  constructor() {
    super("Client not found");
    this.name = "ClientNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = 'fail';
    this.isOperational = true;
    this.layer = "application";
  }
}
