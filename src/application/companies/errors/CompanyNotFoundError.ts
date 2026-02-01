import ApplicationError from "@/application/core/errors/ApplicationError";

export class CompanyNotFoundError extends ApplicationError {
  constructor() {
    super("Company not found");
    this.name = "CompanyNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = 'fail';
    this.isOperational = true;
    this.layer = "application";
  }
}
