import DataException from "@/domain/core/errors/DataError";

export class CompanyId {
  private readonly _value: string
  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    if (!value) throw new DataException("CompanyId cannot be empty");
    return new CompanyId(value.trim());
  }

  get value() {
    return this._value;
  }
}
