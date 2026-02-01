import ApplicationError from "@/application/core/errors/ApplicationError";

export class CompanyCreationError extends ApplicationError {
    constructor(message?: string) {
        super(message || "Failed to create company");
        this.name = "CompanyCreationError";
        this.statusCode = 500;
        this.status = 'error';
        this.isOperational = true;
        this.layer = "application";
     }
}
