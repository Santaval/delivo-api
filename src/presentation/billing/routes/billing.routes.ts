import { Router } from "express";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import { billingWebhookController, creditsController } from "@/dependencyInjection/container";
import jwtAuth from "@/presentation/auth/middlewares/jwtAuth";
import requireCompanyId from "@/presentation/core/middlewares/requireCompanyId";
import requireCompanyMembership from "@/presentation/companies/middlewares/requireCompanyMembership";

const billingRouter = Router();

// ==================== COMPANY (JWT + x-company-id, any role) ====================
billingRouter.get("/credits", jwtAuth, requireCompanyId, requireCompanyMembership, asyncHandler(creditsController.summary.bind(creditsController)));
billingRouter.get("/credits/ledger", jwtAuth, requireCompanyId, requireCompanyMembership, asyncHandler(creditsController.ledger.bind(creditsController)));

// ==================== PUBLIC (server-to-server) ====================
// Server-to-server: NO jwtAuth and NO requireCompanyId here — RevenueCat authenticates
// with the shared secret in the Authorization header (REVENUECAT_WEBHOOK_AUTH).
billingRouter.post("/webhooks/revenuecat", asyncHandler(billingWebhookController.revenueCat.bind(billingWebhookController)));

export default billingRouter;
