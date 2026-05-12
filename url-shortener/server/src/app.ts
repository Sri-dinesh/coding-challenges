import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { auth } from "./config/auth";
import { globalLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { redirectUrl } from "./controllers/url.controller";

import urlRoutes from "./routes/url.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { toNodeHandler } from "better-auth/node";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan(env.isDevelopment ? "dev" : "combined"));

app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.all("/api/auth/*", toNodeHandler(auth));
app.use("/api/urls", urlRoutes);
app.use("/api/analytics", analyticsRoutes);
app.get("/:code", redirectUrl);

app.use(errorHandler);

export default app;
