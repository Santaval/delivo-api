import { Router } from "express";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import jwtAuth from "@/presentation/auth/middlewares/jwtAuth";
import requireCompanyId from "@/presentation/core/middlewares/requireCompanyId";
import { billingController, billingWebhookController } from "@/dependencyInjection/container";

const billingRouter = Router();

// ==================== PUBLIC (server-to-server) ====================
// Server-to-server: NO jwtAuth and NO requireCompanyId here — RevenueCat authenticates
// with the shared secret in the Authorization header (REVENUECAT_WEBHOOK_AUTH).
billingRouter.post("/webhooks/revenuecat", asyncHandler(billingWebhookController.revenueCat.bind(billingWebhookController)));

// ==================== AUTHENTICATED ====================
// Auth middlewares are applied per-route, NOT via billingRouter.use(...), so the
// server-to-server webhook above stays unauthenticated.
billingRouter.get(
  "/subscription",
  jwtAuth,
  requireCompanyId,
  asyncHandler(billingController.subscriptionStatus.bind(billingController)),
);

export default billingRouter;
