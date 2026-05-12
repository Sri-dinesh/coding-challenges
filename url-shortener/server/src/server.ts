import { prisma } from "./config/database";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import app from "./app";

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
    const server = app.listen(env.PORT, () => {
      logger.info(`Server running`, {
        port: env.PORT,
        env: env.NODE_ENV,
        url: env.BASE_URL,
      });
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received. Shuttin down gracefullyyy...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info("Server closed. DB disconnected.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server", { error });
    await prisma.$disconnect();
    process.exit(1);
  }
}
