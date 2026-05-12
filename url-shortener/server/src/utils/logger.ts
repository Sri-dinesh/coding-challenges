import { env } from "node:process";

type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, message: string, meta?: object) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(meta && { meta }),
  };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (env.isDevelopment) {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info: (msg: string, meta?: object) => log("info", msg, meta),
  warn: (msg: string, meta?: object) => log("warn", msg, meta),
  error: (msg: string, meta?: object) => log("error", msg, meta),
  debug: (msg: string, meta?: object) => log("debug", msg, meta),
};
