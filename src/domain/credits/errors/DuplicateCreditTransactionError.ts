import DomainError from "@/domain/core/errors/DomainError";

/**
 * A ledger entry with the same `providerTransactionId` already exists: the provider event
 * was already applied. Callers (webhook handling) treat it as an idempotent no-op.
 */
export class DuplicateCreditTransactionError extends DomainError {
  constructor(message: string = "This credit transaction was already recorded") {
    super(message);
    this.name = "DuplicateCreditTransactionError";
    this.statusCode = 409;
    this.status = "fail";
  }
}
