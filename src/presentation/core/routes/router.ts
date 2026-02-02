import authRouter from "@/presentation/auth/routes/auth.route";
import clientsRouter from "@/presentation/clients/routes/clients.routes";
import companyRouter from "@/presentation/companies/routes/companies.routes";
import ordersRouter from "@/presentation/orders/routes/orders.routes";
import productsRouter from "@/presentation/products/routes/products.routes";
import profileRouter from "@/presentation/users/routes/profiles.routes";
import { Router } from "express";
const router = Router();

// user routes
router.use("/auth", authRouter);
router.use('/me', profileRouter);
// company routes
router.use("/companies", companyRouter);
// client routes
router.use("/clients", clientsRouter);
// products router
router.use("/products", productsRouter)
// orders router
router.use("/orders", ordersRouter);
export default router;