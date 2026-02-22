import { paymentMethodsController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express"
import createPaymentMethodSchema from "../validators/createPaymentMethod";

const paymentMethodsRouter = Router();

paymentMethodsRouter.get("/", asyncHandler(paymentMethodsController.getAllByCompany.bind(paymentMethodsController)))
paymentMethodsRouter.post("/", validateSchema(createPaymentMethodSchema), asyncHandler(paymentMethodsController.create.bind(paymentMethodsController)))

export default paymentMethodsRouter;