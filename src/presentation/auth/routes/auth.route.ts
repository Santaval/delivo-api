import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import { myProfileController } from "@/dependencyInjection/container";
dotenv.config();

const authRouter = Router();



authRouter.post("/google",
  passport.authenticate("local-google", { session: true }),
  asyncHandler(myProfileController.me.bind(myProfileController))
);

authRouter.post("/logout",
  asyncHandler(myProfileController.logout.bind(myProfileController))
);

export default authRouter;
