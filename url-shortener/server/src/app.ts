import express from "express";
import cors from "cors";
import helment from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { globalLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { redirectUrl } from "./controllers/url.controller";

import urlRoutes from "./routes/url.routes";
import { he } from "zod/locales";

const app = express();
app.use(helment());
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

app.use("/api/urls", urlRoutes);

app.get("/:code", redirectUrl);
export default app;
