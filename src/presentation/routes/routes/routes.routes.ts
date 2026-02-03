import { routesController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import createRouteSchema from "../validators/createRoute";

const routesRouter = Router();

routesRouter.post("/", validateSchema(createRouteSchema), asyncHandler(routesController.create.bind(routesController)));

export default routesRouter;
