import ApplicationError from "@/application/core/errors/ApplicationError";

export class ProductCreationError extends ApplicationError {
    constructor(message?: string) {
        super(message || "Failed to create product");
        this.name = "ProductCreationError";
        this.statusCode = 500;
        this.status = 'error';
        this.isOperational = true;
        this.layer = "application";
     }
}
