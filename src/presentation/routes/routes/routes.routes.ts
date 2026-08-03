import { routesController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import createRouteSchema from "../validators/createRoute";
import addRoutePointSchema from "../validators/addRoutePoint";
import startRouteSchema from "../validators/startRoute";
import enforceLimit from "@/presentation/billing/middlewares/enforceLimit";

const routesRouter = Router();

// This router does not mount requireCompanyId; RoutesController reads x-company-id via
// CompanyIdParser, so enforceLimit's default resolver (also CompanyIdParser) is correct here.
routesRouter.post("/", enforceLimit("routes"), validateSchema(createRouteSchema), asyncHandler(routesController.create.bind(routesController)));
routesRouter.get("/", asyncHandler(routesController.findAll.bind(routesController)));
routesRouter.get("/:id", asyncHandler(routesController.findById.bind(routesController)));
routesRouter.post("/:id/points", validateSchema(addRoutePointSchema), asyncHandler(routesController.addPoint.bind(routesController)));
routesRouter.delete("/:id/points/:pointId", asyncHandler(routesController.removePoint.bind(routesController)));
// No enforceLimit here: starting/optimizing a route that was already counted at creation must
// not consume a second "routes" unit.
routesRouter.post("/:id/start", validateSchema(startRouteSchema), asyncHandler(routesController.startOptimization.bind(routesController)));
routesRouter.patch("/points/:pointId/complete", asyncHandler(routesController.completeDelivery.bind(routesController)));
export default routesRouter;
