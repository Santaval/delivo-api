import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
import validateSchema from "@/presentation/core/middlewares/validateSchema";
import { loginSchema } from "../validators/login";
import { authController } from "@/dependencyInjection/container";
import asyncHandler from "@/presentation/core/handlers/asyncHandler";
import { CreateUserSchema } from "@/presentation/users/validators/createUser";
dotenv.config();

const authRouter = Router();


authRouter.post("/login",
  validateSchema(loginSchema), 
  passport.authenticate("local-login", { session: true }),
  asyncHandler(authController.login.bind(authController))
);

authRouter.post("/google",
  passport.authenticate("local-google", { session: true }),
  asyncHandler(authController.login.bind(authController))
);

authRouter.post("/register",
  validateSchema(CreateUserSchema),
  passport.authenticate("local-register", { session: true }),
  asyncHandler(authController.registerUser.bind(authController))
);

authRouter.post("/logout",
  asyncHandler(authController.logout.bind(authController))
);

export default authRouter;
