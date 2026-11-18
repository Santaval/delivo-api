import ApplicationError from "@/application/core/errors/ApplicationError";

export class MemberCodeNotFoundError extends ApplicationError {
  constructor(message: string = "No existe un usuario con ese código") {
    super(message);
    this.name = "MemberCodeNotFoundError";
    this.stack = new Error().stack;
    this.statusCode = 404;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";
  }
}
