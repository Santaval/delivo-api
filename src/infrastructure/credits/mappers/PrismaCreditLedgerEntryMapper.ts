import { CreditLedgerEntry } from "@/domain/credits/entities/CreditLedgerEntry";
import { CreditLedgerEntry as PrismaCreditLedgerEntry } from "@/infrastructure/prisma/generated/prisma/client";

export class PrismaCreditLedgerEntryMapper {
  /** Rows are only ever created inside the repository, so there is no toPersistence. */
  static toDomain(row: PrismaCreditLedgerEntry, billNumber?: number | null): CreditLedgerEntry {
    return new CreditLedgerEntry({
      id: row.id,
      companyId: row.companyId,
      delta: row.delta,
      reason: row.reason,
      balanceAfter: row.balanceAfter,
      billId: row.billId,
      billNumber: billNumber ?? null,
      providerTransactionId: row.providerTransactionId,
      productId: row.productId,
      environment: row.environment,
      note: row.note,
      createdByUserId: row.createdByUserId,
      createdAt: row.createdAt.toISOString(),
    });
  }
}
