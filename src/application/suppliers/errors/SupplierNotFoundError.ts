import ApplicationError from "@/application/core/errors/ApplicationError";

export class SupplierNotFoundError extends ApplicationError {
  constructor() {
    super("Supplier not found");
    this.name = "SupplierNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = 'fail';
    this.isOperational = true;
    this.layer = "application";
  }
}
