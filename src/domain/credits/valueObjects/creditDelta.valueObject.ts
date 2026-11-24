import DataException from "@/domain/core/errors/DataError";

/** Signed change applied to a credit balance: positive = grant, negative = consume. */
export class CreditDelta {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number) {
    if (!Number.isInteger(value) || value === 0) {
      throw new DataException("CreditDelta must be a non-zero integer");
    }
    return new CreditDelta(value);
  }

  get value() {
    return this._value;
  }
}
