import { CreditLedgerEntry } from "@/domain/credits/entities/CreditLedgerEntry";
import { DuplicateCreditTransactionError } from "@/domain/credits/errors/DuplicateCreditTransactionError";
import { CreditGrantInput, ICreditRepository } from "@/domain/credits/repositories/ICreditRepository";
import { PageRequest, PaginatedResult } from "@/domain/core/pagination/Pagination";
import { prisma } from "@/infrastructure/prisma/client";
import { Prisma } from "@/infrastructure/prisma/generated/prisma/client";
import DatabaseError from "@/infrastructure/core/errors/DatabaseError";
import DatabaseInsertError from "@/infrastructure/core/errors/DatabaseInsertError";
import { PrismaCreditLedgerEntryMapper } from "../mappers/PrismaCreditLedgerEntryMapper";

export default class PrismaCreditRepository implements ICreditRepository {

  private readonly client: Prisma.TransactionClient;

  /** Pass a transaction client to join the caller's transaction (unit of work). */
  constructor(client?: Prisma.TransactionClient) {
    this.client = client || prisma;
  }

  /**
   * Runs `fn` in a transaction. When this repository was built with a transaction client it
   * joins the caller's transaction instead of opening a nested one.
   */
  private async runAtomically<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    if (this.client === prisma) return prisma.$transaction((tx) => fn(tx));
    return fn(this.client);
  }

  async getBalance(companyId: string): Promise<number | null> {
    try {
      const row = await this.client.creditBalance.findUnique({
        where: { companyId },
        select: { balance: true },
      });
      return row ? row.balance : null;
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      throw new DatabaseError("Could not fetch credit balance");
    }
  }

  async listEntries(companyId: string, page: PageRequest): Promise<PaginatedResult<CreditLedgerEntry>> {
    try {
      const [rows, total] = await Promise.all([
        this.client.creditLedgerEntry.findMany({
          where: { companyId },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: (page.page - 1) * page.pageSize,
          take: page.pageSize,
        }),
        this.client.creditLedgerEntry.count({ where: { companyId } }),
      ]);

      return {
        items: rows.map((row) => PrismaCreditLedgerEntryMapper.toDomain(row)),
        page: page.page,
        pageSize: page.pageSize,
        total,
      };
    } catch (error) {
      console.error("Error listing credit ledger entries:", error);
      throw new DatabaseError("Could not list credit ledger entries");
    }
  }

  async grant(input: CreditGrantInput): Promise<CreditLedgerEntry> {
    try {
      const row = await this.runAtomically(async (tx) => {
        // Raw upsert: Prisma's upsert is find-then-write on MySQL and would race under
        // concurrent grants for the same company. updatedAt has no DB default, so set it here.
        await tx.$executeRaw`INSERT INTO \`CreditBalance\` (\`companyId\`, \`balance\`, \`updatedAt\`) VALUES (${input.companyId}, ${input.delta}, CURRENT_TIMESTAMP(3)) ON DUPLICATE KEY UPDATE \`balance\` = \`balance\` + ${input.delta}, \`updatedAt\` = CURRENT_TIMESTAMP(3)`;

        const { balance } = await tx.creditBalance.findUniqueOrThrow({
          where: { companyId: input.companyId },
          select: { balance: true },
        });

        return tx.creditLedgerEntry.create({
          data: {
            companyId: input.companyId,
            delta: input.delta,
            reason: input.reason,
            balanceAfter: balance,
            providerTransactionId: input.providerTransactionId ?? null,
            productId: input.productId ?? null,
            environment: input.environment ?? null,
            note: input.note ?? null,
            createdByUserId: input.createdByUserId ?? null,
          },
        });
      });

      return PrismaCreditLedgerEntryMapper.toDomain(row);
    } catch (error) {
      // The unique index on providerTransactionId is the idempotency guard; the transaction
      // rolls back, so the balance increment is undone.
      if (
        input.providerTransactionId &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new DuplicateCreditTransactionError();
      }
      console.error("Error granting credits:", error);
      throw new DatabaseInsertError("Could not grant credits");
    }
  }

  async tryConsume(companyId: string, amount: number, floor: number): Promise<number | null> {
    try {
      // One conditional UPDATE: no read-then-write race. A matched row always changes, so the
      // driver's "found rows" count is also the changed-row count.
      const affected = await this.client.$executeRaw`UPDATE \`CreditBalance\` SET \`balance\` = \`balance\` - ${amount}, \`updatedAt\` = CURRENT_TIMESTAMP(3) WHERE \`companyId\` = ${companyId} AND \`balance\` - ${amount} >= ${floor}`;
      if (affected === 0) return null;

      // Inside the caller's transaction this sees its own write.
      const { balance } = await this.client.creditBalance.findUniqueOrThrow({
        where: { companyId },
        select: { balance: true },
      });
      return balance;
    } catch (error) {
      console.error("Error consuming credits:", error);
      throw new DatabaseError("Could not consume credits");
    }
  }

  async recordBillIssued(input: { companyId: string; billId: string; amount: number; balanceAfter: number }): Promise<CreditLedgerEntry> {
    try {
      const row = await this.client.creditLedgerEntry.create({
        data: {
          companyId: input.companyId,
          delta: -input.amount,
          reason: "BILL_ISSUED",
          balanceAfter: input.balanceAfter,
          billId: input.billId,
        },
      });
      return PrismaCreditLedgerEntryMapper.toDomain(row);
    } catch (error) {
      console.error("Error recording bill credit charge:", error);
      throw new DatabaseInsertError("Could not record bill credit charge");
    }
  }
}
