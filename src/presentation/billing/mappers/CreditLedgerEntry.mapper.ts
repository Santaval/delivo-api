import { CreditLedgerEntry } from "@/domain/credits/entities/CreditLedgerEntry";
import CreditLedgerEntryResponse, { AdminCreditLedgerEntryResponse } from "../responses/CreditLedgerEntryResponse";

export default class CreditLedgerEntryMapper {
  static toResponse(entry: CreditLedgerEntry): CreditLedgerEntryResponse {
    return {
      id: entry.id,
      reason: entry.reason,
      delta: entry.delta,
      balanceAfter: entry.balanceAfter,
      createdAt: entry.createdAt.toISOString(),
      billId: entry.billId,
      billNumber: entry.billNumber,
      productId: entry.productId,
      note: entry.note,
    };
  }

  static toAdminResponse(entry: CreditLedgerEntry): AdminCreditLedgerEntryResponse {
    return {
      ...CreditLedgerEntryMapper.toResponse(entry),
      environment: entry.environment,
      createdByUserId: entry.createdByUserId,
    };
  }
}
