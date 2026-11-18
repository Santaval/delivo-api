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
    /** When false, events from the store sandbox are acknowledged without touching the ledger. */
    private readonly acceptSandbox: boolean,
  ) { }

  async applyEvent(event: CreditEvent): Promise<CreditEventOutcome> {
    // Checked first: it needs no lookup, and a sandbox event must never reach the ledger on a
    // deployment that does not accept it. Events without an environment count as production.
    if (event.environment === "SANDBOX" && !this.acceptSandbox) {
      console.info(`[billing] ignoring sandbox event (eventId=${event.eventId}, kind=${event.kind})`);
      return "SANDBOX_IGNORED";
    }

    const credits = creditsForProduct(event.productId);
    if (credits === null) {
      console.warn(`[billing] ignoring event for unknown product (eventId=${event.eventId}, productId=${event.productId})`);
      return "UNKNOWN_PRODUCT";
    }

    // A late webhook can arrive after the company was deleted; the ledger insert would hit a
    // missing foreign key and the provider would retry forever. Acknowledge instead.
    const isPurchase = event.kind === "PURCHASE";

    // A refund belongs to the company that received the original purchase. The event's
    // app_user_id can differ from it (e.g. RevenueCat transferred the purchase to another
    // app user), so resolve the company from the purchase's ledger row. Fall back to the
    // event's company when the purchase is not in our ledger.
    let companyId = event.companyId;
    if (!isPurchase) {
      const purchaseCompanyId = await this.creditRepository.findCompanyIdByProviderTransactionId(event.transactionId);
      if (purchaseCompanyId && purchaseCompanyId !== event.companyId) {
        console.info(
          `[billing] refund attributed to purchasing company (eventId=${event.eventId}, eventCompanyId=${event.companyId}, purchaseCompanyId=${purchaseCompanyId})`,
        );
      }
      companyId = purchaseCompanyId ?? event.companyId;
    }

    const company = await this.companyRepository.find(companyId, "id");
    if (!company) {
      console.warn(`[billing] ignoring event for unknown company (eventId=${event.eventId}, companyId=${companyId})`);
      return "UNKNOWN_COMPANY";
    }

    const delta = isPurchase ? credits : -credits;

    try {
      // Refunds skip the floor check: the balance may go below the overdraft floor, and bills
      // stay blocked until the company buys credits again.
      await this.creditRepository.grant({
        companyId,
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
      `[billing] applied event (eventId=${event.eventId}, kind=${event.kind}, companyId=${companyId}, delta=${delta}, environment=${event.environment ?? "unknown"})`,
    );
    return "APPLIED";
  }
}
