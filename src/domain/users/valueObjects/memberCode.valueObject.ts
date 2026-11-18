import DataException from "@/domain/core/errors/DataError";

export class MemberCode {
  private constructor(private readonly _value: string) {}

  static create(value: string) {
    if (typeof value !== "string" || !/^\d{6}$/.test(value)) {
      throw new DataException("Invalid member code");
    }
    return new MemberCode(value);
  }

  get value() {
    return this._value;
  }
}
