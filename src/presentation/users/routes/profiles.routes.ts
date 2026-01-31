import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { Router } from "express";
import { UpdateUserSchema } from "../validators/updateUser";
import { myProfileController } from "@/dependencyInjection/container";
import updateInterestsSchema from "../validators/updateInterests";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import requireAuth from "@/presentation/auth/middlewares/requireAuth";

const profileRouter = Router();

// @ts-expect-error
profileRouter.use(requireAuth);
profileRouter.put("/", validateSchema(UpdateUserSchema), asyncHandler(myProfileController.update.bind(myProfileController)));
profileRouter.get("/", asyncHandler(myProfileController.me.bind(myProfileController)));
profileRouter.get("/interests", asyncHandler(myProfileController.interests.bind(myProfileController)));
profileRouter.put("/interests", validateSchema(updateInterestsSchema), asyncHandler(myProfileController.updateInterests.bind(myProfileController)));
profileRouter.post("/onboarding/completed", asyncHandler(myProfileController.completeOnboarding.bind(myProfileController)));

export default profileRouter;
