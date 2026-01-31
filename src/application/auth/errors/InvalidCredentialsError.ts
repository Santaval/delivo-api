import ApplicationError from "@/application/core/errors/ApplicationError";

export class InvalidCredentialsError extends ApplicationError {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
    this.stack = new Error().stack;
    this.statusCode = 401;
    this.status = 'fail';
    this.isOperational = true;
    this.layer = "application";
  }
}