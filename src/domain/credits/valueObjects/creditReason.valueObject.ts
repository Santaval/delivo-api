import DataException from "@/domain/core/errors/DataError";

export type CreditReasonType = "WELCOME_GRANT" | "PURCHASE" | "BILL_ISSUED" | "REFUND" | "ADMIN_ADJUSTMENT";

export const CREDIT_REASONS: CreditReasonType[] = ["WELCOME_GRANT", "PURCHASE", "BILL_ISSUED", "REFUND", "ADMIN_ADJUSTMENT"];

export class CreditReason {
  private readonly _value: CreditReasonType;

  private constructor(value: CreditReasonType) {
    this._value = value;
  }

  static create(value: string): CreditReason {
    if (!CREDIT_REASONS.includes(value as CreditReasonType)) {
      throw new DataException(`Invalid credit reason: ${value}. Valid reasons are: ${CREDIT_REASONS.join(", ")}`);
    }

    return new CreditReason(value as CreditReasonType);
  }

  get value(): CreditReasonType {
    return this._value;
  }
}
