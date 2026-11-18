import ApplicationError from "@/application/core/errors/ApplicationError";

/** Machine-readable body returned to the client as HTTP 402. */
export interface InsufficientCreditsPayload {
  code: "INSUFFICIENT_CREDITS";
  balance: number;
  overdraftFloor: number;
  required: number;
}

export interface InsufficientCreditsErrorParams {
  balance: number;
  overdraftFloor: number;
  required: number;
}

/**
 * Raised when issuing a bill would take the company's credit balance below the overdraft
 * floor. The presentation error handler maps it to HTTP 402 with `toPayload()`.
 */
export class InsufficientCreditsError extends ApplicationError {
  readonly code = "INSUFFICIENT_CREDITS";
  readonly balance: number;
  readonly overdraftFloor: number;
  readonly required: number;

  constructor(params: InsufficientCreditsErrorParams) {
    super(`Insufficient credits (balance ${params.balance}, floor ${params.overdraftFloor}, required ${params.required})`);
    this.name = "InsufficientCreditsError";
    this.stack = new Error().stack;
    this.statusCode = 402;
    this.status = "fail";
    this.isOperational = true;
    this.layer = "application";

    this.balance = params.balance;
    this.overdraftFloor = params.overdraftFloor;
    this.required = params.required;
  }

  toPayload(): InsufficientCreditsPayload {
    return {
      code: this.code,
      balance: this.balance,
      overdraftFloor: this.overdraftFloor,
      required: this.required,
    };
  }
}
