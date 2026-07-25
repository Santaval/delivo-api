import DataException from "@/domain/core/errors/DataError";

export class InvitationToken {
  private readonly _value: string
  private constructor(value: string) {
    this._value = value
  }

  static create(value: string) {
    if (!value) throw new DataException("InvitationToken cannot be empty");
    return new InvitationToken(value.trim());
  }

  get value() {
    return this._value;
  }
}
