import authRouter from "@/presentation/auth/routes/auth.route";
import companyRouter from "@/presentation/companies/routes/companies.routes";
import profileRouter from "@/presentation/users/routes/profiles.routes";
import { Router } from "express";
const router = Router();

// user routes
router.use("/auth", authRouter);
router.use('/me', profileRouter);
// company routes
router.use("/companies", companyRouter);
export default router;