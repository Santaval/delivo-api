export default interface CreditLedgerEntryResponse {
  id: string;
  reason: string;
  delta: number;
  balanceAfter: number;
  createdAt: string;
  billId: string | null;
  /** Number of the bill for BILL_ISSUED rows; null for other reasons or when the bill was deleted. */
  billNumber: number | null;
  productId: string | null;
  note: string | null;
}

/** Support view: adds the fields that are not meant for the company's own app. */
export interface AdminCreditLedgerEntryResponse extends CreditLedgerEntryResponse {
  environment: string | null;
  createdByUserId: string | null;
}
