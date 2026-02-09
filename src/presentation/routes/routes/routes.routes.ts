import { routesController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import createRouteSchema from "../validators/createRoute";
import addRoutePointSchema from "../validators/addRoutePoint";
import startRouteSchema from "../validators/startRoute";

const routesRouter = Router();

routesRouter.post("/", validateSchema(createRouteSchema), asyncHandler(routesController.create.bind(routesController)));
routesRouter.get("/", asyncHandler(routesController.findAll.bind(routesController)));
routesRouter.get("/:id", asyncHandler(routesController.findById.bind(routesController)));
routesRouter.post("/:id/points", validateSchema(addRoutePointSchema), asyncHandler(routesController.addPoint.bind(routesController)));
routesRouter.delete("/:id/points/:pointId", asyncHandler(routesController.removePoint.bind(routesController)));
routesRouter.post("/:id/start", validateSchema(startRouteSchema), asyncHandler(routesController.startOptimization.bind(routesController)));
export default routesRouter;
