import { ordersController } from "@/dependencyInjection/container";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import createOrderSchema from "../validators/createOrder";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import addOrderItemSchema from "../validators/addOrderItem";
import addPaymentSchema from "../validators/addPayment";
import requireCompanyId from "@/presentation/core/middlewares/requireCompanyId";

const ordersRouter = Router();

ordersRouter.get("/", asyncHandler(ordersController.ordersByCompany.bind(ordersController)));
ordersRouter.get("/bills", asyncHandler(ordersController.billsByCompany.bind(ordersController)));
// Creating a bill consumes one credit inside OrdersService (same transaction as the insert), so
// there is no pre-check middleware. requireCompanyId keeps a missing x-company-id a 400 instead
// of reaching the transaction and surfacing as a misleading 402.
ordersRouter.post("/", requireCompanyId, validateSchema(createOrderSchema), asyncHandler(ordersController.create.bind(ordersController)));
ordersRouter.get("/:id", asyncHandler(ordersController.findById.bind(ordersController)));
ordersRouter.patch("/:id/delivered", asyncHandler(ordersController.markAsDelivered.bind(ordersController)));
ordersRouter.post("/:id/items", validateSchema(addOrderItemSchema), asyncHandler(ordersController.addItem.bind(ordersController)));
ordersRouter.delete("/:id/items/:itemId", asyncHandler(ordersController.removeItem.bind(ordersController)));
ordersRouter.get("/client/:clientId", asyncHandler(ordersController.byClient.bind(ordersController)));
ordersRouter.get("/client/:clientId/billed", asyncHandler(ordersController.byClientBilled.bind(ordersController)));
ordersRouter.post("/:id/payments", validateSchema(addPaymentSchema), asyncHandler(ordersController.addPayment.bind(ordersController)));

export default ordersRouter;
