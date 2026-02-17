import { paymentMethodsController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import { Router } from "express"

const paymentMethodsRouter = Router();

paymentMethodsRouter.get("/", asyncHandler(paymentMethodsController.getAllByCompany.bind(paymentMethodsController)))

export default paymentMethodsRouter;