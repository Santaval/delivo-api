import authRouter from "@/presentation/auth/routes/auth.route";
import clientsRouter from "@/presentation/clients/routes/clients.routes";
import companyRouter from "@/presentation/companies/routes/companies.routes";
import locationRouter from "@/presentation/geolocation/routes/location.route";
import ordersRouter from "@/presentation/orders/routes/orders.routes";
import productsRouter from "@/presentation/products/routes/products.routes";
import routesRouter from "@/presentation/routes/routes/routes.routes";
import statsRouter from "@/presentation/stats/routes/stats.routes";
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
// routes router
router.use("/routes", routesRouter);
// stats router
router.use("/stats", statsRouter);
router.use('/locations', locationRouter);


export default router;