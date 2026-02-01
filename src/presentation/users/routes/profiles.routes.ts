import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import { UpdateUserSchema } from "../validators/updateUser";
import { myProfileController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import requireAuth from "@/presentation/auth/middlewares/requireAuth";

const profileRouter = Router();

profileRouter.use(requireAuth);
profileRouter.put("/", validateSchema(UpdateUserSchema), asyncHandler(myProfileController.update.bind(myProfileController)));
profileRouter.get("/", asyncHandler(myProfileController.me.bind(myProfileController)));

export default profileRouter;
