import ApplicationError from "@/application/core/errors/ApplicationError";

export class ClientCreationError extends ApplicationError {
    constructor(message?: string) {
        super(message || "Failed to create client");
        this.name = "ClientCreationError";
        this.statusCode = 500;
        this.status = 'error';
        this.isOperational = true;
        this.layer = "application";
     }
}
