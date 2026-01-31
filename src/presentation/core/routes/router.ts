import authRouter from "@/presentation/auth/routes/auth.route";
import profileRouter from "@/presentation/users/routes/profiles.routes";
import { Router } from "express";
const router = Router();

// user routes
router.use("/auth", authRouter);
router.use('/me', profileRouter);
export default router;