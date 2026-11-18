import { Request, Response } from "express";
import { IPaymentProvider } from "@/domain/billing/providers/IPaymentProvider";

export default class BillingWebhookController {
  constructor(private readonly paymentProvider: IPaymentProvider) {}

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

    // Interim: subscriptions were removed in favour of pay-per-bill credits. The event is
    // acknowledged (so RevenueCat does not retry) but not applied; credit packs are wired
    // in #68.
    console.warn(`[billing] subscription events are no longer applied; see #68 (eventId=${event.eventId}, kind=${event.kind})`);
    res.status(202).json({ message: "Event ignored" });
  }
}
