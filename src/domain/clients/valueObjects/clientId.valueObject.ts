import DataException from "@/domain/core/errors/DataError";

export class ClientId {
  private readonly _value: string
  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    if (!value) throw new DataException("ClientId cannot be empty");
    return new ClientId(value.trim());
  }

  get value() {
    return this._value;
  }
}
