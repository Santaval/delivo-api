import ApplicationError from "@/application/core/errors/ApplicationError";

export class SupplierCreationError extends ApplicationError {
    constructor(message?: string) {
        super(message || "Failed to create supplier");
        this.name = "SupplierCreationError";
        this.statusCode = 500;
        this.status = 'error';
        this.isOperational = true;
        this.layer = "application";
     }
}
