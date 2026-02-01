import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import { UpdateUserSchema } from "../validators/updateUser";
import { myProfileController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import jwtAuth from "@/presentation/auth/middlewares/jwtAuth";

const profileRouter = Router();

profileRouter.use(jwtAuth);
profileRouter.put("/", validateSchema(UpdateUserSchema), asyncHandler(myProfileController.update.bind(myProfileController)));
profileRouter.get("/", asyncHandler(myProfileController.me.bind(myProfileController)));

export default profileRouter;
