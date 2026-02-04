import { statsController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import requireCompanyId from "@/presentation/core/middlewares/requireCompanyId";
import { Router } from "express";

const statsRouter = Router();

statsRouter.use(requireCompanyId)
statsRouter.get("/financial-summary", asyncHandler(statsController.financialSummary.bind(statsController)));

export default statsRouter;