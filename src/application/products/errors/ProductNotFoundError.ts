import ApplicationError from "@/application/core/errors/ApplicationError";

export class ProductNotFoundError extends ApplicationError {
  constructor() {
    super("Product not found");
    this.name = "ProductNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = 'fail';
    this.isOperational = true;
    this.layer = "application";
  }
}
