import { Router } from "express";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import { billingWebhookController } from "@/dependencyInjection/container";

const billingRouter = Router();

// ==================== PUBLIC (server-to-server) ====================
// Server-to-server: NO jwtAuth and NO requireCompanyId here — RevenueCat authenticates
// with the shared secret in the Authorization header (REVENUECAT_WEBHOOK_AUTH).
billingRouter.post("/webhooks/revenuecat", asyncHandler(billingWebhookController.revenueCat.bind(billingWebhookController)));

// ==================== AUTHENTICATED ====================
// Issue #18 adds GET /subscription (jwtAuth + requireCompanyId) here.

export default billingRouter;
