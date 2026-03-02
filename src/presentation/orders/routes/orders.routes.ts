import { ordersController } from "@/dependencyInjection/container";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import createOrderSchema from "../validators/createOrder";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import addOrderItemSchema from "../validators/addOrderItem";
import addPaymentSchema from "../validators/addPayment";

const ordersRouter = Router();

ordersRouter.get("/", asyncHandler(ordersController.ordersByCompany.bind(ordersController)));
ordersRouter.get("/bills", asyncHandler(ordersController.billsByCompany.bind(ordersController)));
ordersRouter.post("/", validateSchema(createOrderSchema), asyncHandler(ordersController.create.bind(ordersController)));
ordersRouter.get("/:id", asyncHandler(ordersController.findById.bind(ordersController)));
ordersRouter.post("/:id/items", validateSchema(addOrderItemSchema), asyncHandler(ordersController.addItem.bind(ordersController)));
ordersRouter.delete("/:id/items/:itemId", asyncHandler(ordersController.removeItem.bind(ordersController)));
ordersRouter.get("/client/:clientId", asyncHandler(ordersController.byClient.bind(ordersController)));
ordersRouter.post("/:id/payments", validateSchema(addPaymentSchema), asyncHandler(ordersController.addPayment.bind(ordersController)));

export default ordersRouter;
