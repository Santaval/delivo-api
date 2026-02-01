import DataException from "@/domain/core/errors/DataError";

export class ProductId {
  private readonly _value: string
  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    if (!value) throw new DataException("ProductId cannot be empty");
    return new ProductId(value.trim());
  }

  get value() {
    return this._value;
  }
}