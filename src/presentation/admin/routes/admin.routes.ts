import { Router } from "express";
import { adminCreditsController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import rateLimit from "@/presentation/core/middlewares/rateLimit";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import requireAdminKey from "../middlewares/requireAdminKey";
import adminCreditAdjustmentSchema from "../validators/adminCreditAdjustment";

const adminRouter = Router();

// The limiter runs before the key check so failed key attempts count too (10 / 15 min per IP).
adminRouter.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }), requireAdminKey);

adminRouter.post("/companies/:companyId/credits", validateSchema(adminCreditAdjustmentSchema), asyncHandler(adminCreditsController.adjust.bind(adminCreditsController)));
adminRouter.get("/companies/:companyId/credits", asyncHandler(adminCreditsController.overview.bind(adminCreditsController)));

export default adminRouter;
