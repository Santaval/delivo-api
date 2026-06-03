import DataException from "@/domain/core/errors/DataError";

export class SupplierId {
  private readonly _value: string
  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) throw new DataException("SupplierId cannot be empty");
    return new SupplierId(trimmed);
  }

  get value() {
    return this._value;
  }
}
