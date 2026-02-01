import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "passport";
import { passportConfig } from "./auth/passport/passportConfig";
import origins from "./core/config/origins";
import router from "./core/routes/router";
import errorHandler from "./core/middlewares/errorHandler";
import { sessionMiddleware } from "./core/middlewares/session";

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

// Session middleware
app.use(sessionMiddleware);

// Passport setup
passportConfig();
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use("/api/v1", router);

app.use(errorHandler);

export default app;
