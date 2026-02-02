import { ordersController } from "@/dependencyInjection/container";
import { Router } from "express";

const ordersRouter = Router();

ordersRouter.get("/", ordersController.findByCompany.bind(ordersController));

export default ordersRouter;
