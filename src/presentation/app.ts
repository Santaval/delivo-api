import express from "express";
import cors from "cors";
import morgan from "morgan";
import origins from "./core/config/origins";
import router from "./core/routes/router";
import linksRouter from "./links/routes/links.routes";
import errorHandler from "./core/middlewares/errorHandler";

const app = express();

// Trust reverse proxy
app.set("trust proxy", true);

// Logging
app.use(morgan("dev"));

// CORS config
app.use(
  cors({
    origin: origins,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

// Body parsing
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API routes
app.use("/api/v1", router);

// Public link-domain routes (invitation landing page + universal/app link verification files)
app.use(linksRouter);

app.use(errorHandler);

export default app;
