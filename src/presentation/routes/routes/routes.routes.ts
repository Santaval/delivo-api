import { routesController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import createRouteSchema from "../validators/createRoute";
import addRoutePointSchema from "../validators/addRoutePoint";
import startRouteSchema from "../validators/startRoute";
import enforceLimit from "@/presentation/billing/middlewares/enforceLimit";

import assignDriverSchema from "../validators/assignDriver";
import reportLocationSchema from "../validators/reportLocation";
import rateLimit from "@/presentation/core/middlewares/rateLimit";
import jwtAuth from "@/presentation/auth/middlewares/jwtAuth";

const routesRouter = Router();

// Required so handlers can identify the caller (e.g. GET /?driverId=me).
routesRouter.use(jwtAuth);

// This router does not mount requireCompanyId; RoutesController reads x-company-id via
// CompanyIdParser, so enforceLimit's default resolver (also CompanyIdParser) is correct here.
routesRouter.post("/", enforceLimit("routes"), validateSchema(createRouteSchema), asyncHandler(routesController.create.bind(routesController)));
routesRouter.get("/", asyncHandler(routesController.findAll.bind(routesController)));
routesRouter.patch("/:id/driver", validateSchema(assignDriverSchema), asyncHandler(routesController.assignDriver.bind(routesController)));
// Live driver location (see docs/live-tracking.md). Bearer auth only (jwtAuth above).
routesRouter.post(
  "/:id/location",
  // 60 requests / min per user (the app sends roughly one batch every few seconds)
  rateLimit({
    windowMs: 60_000,
    max: 60,
    // @ts-expect-error req.user typing conflicts with @types/passport (see express.d.ts)
    keyGenerator: (req) => `route-location:${req.user?.id ?? req.ip}`,
  }),
  validateSchema(reportLocationSchema),
  asyncHandler(routesController.reportLocation.bind(routesController)),
);
routesRouter.get("/:id/location", asyncHandler(routesController.getLocation.bind(routesController)));
routesRouter.get("/:id/location/stream", asyncHandler(routesController.streamLocation.bind(routesController)));
routesRouter.get("/:id", asyncHandler(routesController.findById.bind(routesController)));
routesRouter.post("/:id/points", validateSchema(addRoutePointSchema), asyncHandler(routesController.addPoint.bind(routesController)));
routesRouter.delete("/:id/points/:pointId", asyncHandler(routesController.removePoint.bind(routesController)));
// No enforceLimit here: starting/optimizing a route that was already counted at creation must
// not consume a second "routes" unit.
routesRouter.post("/:id/start", validateSchema(startRouteSchema), asyncHandler(routesController.startOptimization.bind(routesController)));
routesRouter.patch("/points/:pointId/complete", asyncHandler(routesController.completeDelivery.bind(routesController)));
export default routesRouter;
