import dotenv from "dotenv";
import { required } from "zod/mini";
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variables: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "5000", 10),
  DATABASE_URL: requireEnv("DATABASE_URL"),

  BETTER_AUTH_SECRET: requireEnv("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

  BASE_URL: process.env.BASE_URL || "http://localhost:5000",
  RATE_LIMIT_WINDOW_MS: parseInt(
    process.env.RATE_LIMIT_WINDOW_MS || "900000",
    10,
  ),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  CLIENT_URL: requireEnv("CLIENT_URL"),
} as const;
