import { Router } from "express";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { GoogleLoginSchema } from "../validators/googleLogin";
import { authController } from "@/dependencyInjection/container";
import jwtAuth from "../middlewares/jwtAuth";

const authRouter = Router();

// Google OAuth login - returns JWT token
authRouter.post("/google",
  validateSchema(GoogleLoginSchema),
  asyncHandler(authController.googleLogin.bind(authController))
);

// Refresh JWT token
authRouter.post("/refresh",
  asyncHandler(authController.refreshToken.bind(authController))
);

// Logout (client-side token removal)
authRouter.post("/logout",
  jwtAuth, // Require valid token to logout
  asyncHandler(authController.logout.bind(authController))
);

export default authRouter;
