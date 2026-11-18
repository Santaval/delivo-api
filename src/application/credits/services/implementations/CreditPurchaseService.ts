import { creditsForProduct } from "@/application/credits/CreditPolicy";
import { CreditEventOutcome, ICreditPurchaseService } from "@/application/credits/services/interfaces/ICreditPurchaseService";
import { CreditEvent } from "@/domain/billing/providers/IPaymentProvider";
import { ICompanyRepository } from "@/domain/companies/repositories/ICompanyRepository";
import { DuplicateCreditTransactionError } from "@/domain/credits/errors/DuplicateCreditTransactionError";
import { ICreditRepository } from "@/domain/credits/repositories/ICreditRepository";

export class CreditPurchaseService implements ICreditPurchaseService {
  constructor(
    private readonly creditRepository: ICreditRepository,
    private readonly companyRepository: ICompanyRepository,
  ) { }

  async applyEvent(event: CreditEvent): Promise<CreditEventOutcome> {
    const credits = creditsForProduct(event.productId);
    if (credits === null) {
      console.warn(`[billing] ignoring event for unknown product (eventId=${event.eventId}, productId=${event.productId})`);
      return "UNKNOWN_PRODUCT";
    }

    // A late webhook can arrive after the company was deleted; the ledger insert would hit a
    // missing foreign key and the provider would retry forever. Acknowledge instead.
    const company = await this.companyRepository.find(event.companyId, "id");
    if (!company) {
      console.warn(`[billing] ignoring event for unknown company (eventId=${event.eventId}, companyId=${event.companyId})`);
      return "UNKNOWN_COMPANY";
    }

    const isPurchase = event.kind === "PURCHASE";
    const delta = isPurchase ? credits : -credits;

    try {
      // Refunds skip the floor check: the balance may go below the overdraft floor, and bills
      // stay blocked until the company buys credits again.
      await this.creditRepository.grant({
        companyId: event.companyId,
        delta,
        reason: isPurchase ? "PURCHASE" : "REFUND",
        providerTransactionId: isPurchase ? event.transactionId : `refund:${event.transactionId}`,
        productId: event.productId,
        environment: event.environment,
      });
    } catch (error) {
      // The unique providerTransactionId is the idempotency guard, also for concurrent replays.
      if (error instanceof DuplicateCreditTransactionError) {
        console.info(`[billing] duplicate event, already applied (eventId=${event.eventId}, kind=${event.kind})`);
        return "DUPLICATE";
      }
      throw error;
    }

    console.info(
      `[billing] applied event (eventId=${event.eventId}, kind=${event.kind}, companyId=${event.companyId}, delta=${delta}, environment=${event.environment ?? "unknown"})`,
    );
    return "APPLIED";
  }
}
