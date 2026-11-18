import ApplicationError from "@/application/core/errors/ApplicationError";

export class MemberCodeGenerationError extends ApplicationError {
  constructor(message: string = "Could not generate a unique member code") {
    super(message);
    this.name = "MemberCodeGenerationError";
    this.stack = new Error().stack;
    this.statusCode = 500;
    this.status = "error";
  }
}
