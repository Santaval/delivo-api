import { ordersController } from "@/dependencyInjection/container";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import createOrderSchema from "../validators/createOrder";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import addOrderItemSchema from "../validators/addOrderItem";
import addPaymentSchema from "../validators/addPayment";
import enforceLimit from "@/presentation/billing/middlewares/enforceLimit";

const ordersRouter = Router();

ordersRouter.get("/", asyncHandler(ordersController.ordersByCompany.bind(ordersController)));
ordersRouter.get("/bills", asyncHandler(ordersController.billsByCompany.bind(ordersController)));
// This router does not mount requireCompanyId; OrdersController reads x-company-id via
// CompanyIdParser, so enforceLimit's default resolver (also CompanyIdParser) is correct here.
ordersRouter.post("/", enforceLimit("documents"), validateSchema(createOrderSchema), asyncHandler(ordersController.create.bind(ordersController)));
ordersRouter.get("/:id", asyncHandler(ordersController.findById.bind(ordersController)));
ordersRouter.patch("/:id/delivered", asyncHandler(ordersController.markAsDelivered.bind(ordersController)));
ordersRouter.post("/:id/items", validateSchema(addOrderItemSchema), asyncHandler(ordersController.addItem.bind(ordersController)));
ordersRouter.delete("/:id/items/:itemId", asyncHandler(ordersController.removeItem.bind(ordersController)));
ordersRouter.get("/client/:clientId", asyncHandler(ordersController.byClient.bind(ordersController)));
ordersRouter.get("/client/:clientId/billed", asyncHandler(ordersController.byClientBilled.bind(ordersController)));
ordersRouter.post("/:id/payments", validateSchema(addPaymentSchema), asyncHandler(ordersController.addPayment.bind(ordersController)));

export default ordersRouter;
