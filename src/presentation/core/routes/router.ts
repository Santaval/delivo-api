import authRouter from "@/presentation/auth/routes/auth.route";
import clientsRouter from "@/presentation/clients/routes/clients.routes";
import companyRouter from "@/presentation/companies/routes/companies.routes";
import locationRouter from "@/presentation/geolocation/routes/location.route";
import ordersRouter from "@/presentation/orders/routes/orders.routes";
import paymentMethodsRouter from "@/presentation/orders/routes/paymentMethods.routes";
import productsRouter from "@/presentation/products/routes/products.routes";
import routesRouter from "@/presentation/routes/routes/routes.routes";
import statsRouter from "@/presentation/stats/routes/stats.routes";
import profileRouter from "@/presentation/users/routes/profiles.routes";
import { Router } from "express";
const router = Router();

// user routes
router.use("/auth", authRouter);
router.use('/me', profileRouter);
router.use("/companies", companyRouter);
router.use("/clients", clientsRouter);
router.use("/products", productsRouter)
router.use("/orders", ordersRouter);
router.use("/routes", routesRouter);
router.use("/stats", statsRouter);
router.use('/locations', locationRouter);
router.use('/payments/methods', paymentMethodsRouter);


export default router;