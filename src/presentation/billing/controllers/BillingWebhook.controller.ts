import { Request, Response } from "express";
import { IPaymentProvider } from "@/domain/billing/providers/IPaymentProvider";
import { ISubscriptionSyncService } from "@/application/billing/services/interfaces/ISubscriptionSyncService";

export default class BillingWebhookController {
  constructor(
    private readonly paymentProvider: IPaymentProvider,
    private readonly subscriptionSyncService: ISubscriptionSyncService,
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

    await this.subscriptionSyncService.applyEvent(event);
    res.status(200).json({ message: "Event processed" });
  }
}
