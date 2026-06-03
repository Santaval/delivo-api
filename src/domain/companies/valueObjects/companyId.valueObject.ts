import DataException from "@/domain/core/errors/DataError";

export class CompanyId {
  private readonly _value: string
  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    const trimmed = value?.trim();
    if (!trimmed) throw new DataException("CompanyId cannot be empty");
    return new CompanyId(trimmed);
  }

  get value() {
    return this._value;
  }
}
