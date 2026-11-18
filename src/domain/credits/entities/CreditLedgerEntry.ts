import { CreditLedgerEntryId } from "@/domain/credits/valueObjects/creditLedgerEntryId.valueObject";
import { CreditDelta } from "@/domain/credits/valueObjects/creditDelta.valueObject";
import { CreditReason, CreditReasonType } from "@/domain/credits/valueObjects/creditReason.valueObject";
import { CompanyId } from "@/domain/companies/valueObjects/companyId.valueObject";

/** One immutable row of a company's credit ledger (append-only audit trail). */
export class CreditLedgerEntry {
  private props: CreditLedgerEntryProps;

  constructor(props: CreditLedgerEntryConstructorProps) {
    this.props = {
      id: CreditLedgerEntryId.create(props.id),
      companyId: CompanyId.create(props.companyId),
      delta: CreditDelta.create(props.delta),
      reason: CreditReason.create(props.reason),
      balanceAfter: props.balanceAfter,
      billId: props.billId ?? null,
      providerTransactionId: props.providerTransactionId ?? null,
      productId: props.productId ?? null,
      environment: props.environment ?? null,
      note: props.note ?? null,
      createdByUserId: props.createdByUserId ?? null,
      createdAt: new Date(props.createdAt),
    };
  }

  get id() { return this.props.id.value; }
  get companyId() { return this.props.companyId.value; }
  get delta() { return this.props.delta.value; }
  get reason() { return this.props.reason.value; }
  get balanceAfter() { return this.props.balanceAfter; }
  get billId() { return this.props.billId; }
  get providerTransactionId() { return this.props.providerTransactionId; }
  get productId() { return this.props.productId; }
  get environment() { return this.props.environment; }
  get note() { return this.props.note; }
  get createdByUserId() { return this.props.createdByUserId; }
  get createdAt() { return this.props.createdAt; }
}

export interface CreditLedgerEntryProps {
  id: CreditLedgerEntryId;
  companyId: CompanyId;
  delta: CreditDelta;
  reason: CreditReason;
  balanceAfter: number;
  billId: string | null;
  providerTransactionId: string | null;
  productId: string | null;
  environment: string | null;
  note: string | null;
  createdByUserId: string | null;
  createdAt: Date;
}

export interface CreditLedgerEntryConstructorProps {
  id: string;
  companyId: string;
  delta: number;
  reason: CreditReasonType | string;
  balanceAfter: number;
  billId?: string | null;
  providerTransactionId?: string | null;
  productId?: string | null;
  environment?: string | null;
  note?: string | null;
  createdByUserId?: string | null;
  createdAt: Date | string;
}
