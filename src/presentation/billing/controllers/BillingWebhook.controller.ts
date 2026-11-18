import { Request, Response } from "express";
import { ICreditPurchaseService } from "@/application/credits/services/interfaces/ICreditPurchaseService";
import { IPaymentProvider } from "@/domain/billing/providers/IPaymentProvider";

export default class BillingWebhookController {
  constructor(
    private readonly paymentProvider: IPaymentProvider,
    private readonly creditPurchaseService: ICreditPurchaseService,
  ) {}

  /** POST /billing/webhooks/revenuecat — server-to-server, authenticated via shared secret. */
  async revenueCat(req: Request, res: Response): Promise<void> {
    if (!this.paymentProvider.verifyWebhook(req.headers)) {
      res.status(401).json({ message: "Invalid webhook signature" });
      return;
    }

    const event = this.paymentProvider.parseWebhookEvent(req.body);
    if (!event) {
      // Ack so the provider does not retry an event type we deliberately ignore.
      res.status(202).json({ message: "Event ignored" });
      return;
    }

    const outcome = await this.creditPurchaseService.applyEvent(event);
    switch (outcome) {
      case "UNKNOWN_PRODUCT":
        res.status(202).json({ message: "Event ignored" });
        return;
      case "DUPLICATE":
        res.status(200).json({ message: "Event already processed" });
        return;
      default:
        // APPLIED, or UNKNOWN_COMPANY (acknowledged so the provider does not retry).
        res.status(200).json({ message: "Event processed" });
    }
  }
}
