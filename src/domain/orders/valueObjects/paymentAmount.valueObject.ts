import DataError from "@/domain/core/errors/DataError";

export class PaymentAmount {

  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): PaymentAmount {

    if (value <= 0) {
      throw new DataError("Payment amount cannot be negative or zero");
    }

    return new PaymentAmount(value);
  }

  get value(): number {
    return this._value;
  }
}

