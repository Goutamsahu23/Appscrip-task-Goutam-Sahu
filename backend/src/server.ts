import { createApp } from './app';
import { env } from './config/env';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';

async function main() {
  await prisma.$connect();
  logger.info('Database connected');

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  function shutdown(signal: string) {
    logger.info(`${signal} received, shutting down`);

    server.close(async (err) => {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        logger.error({ err: disconnectError }, 'Error while disconnecting from database');
      }

      if (err) {
        logger.error({ err }, 'Error while closing server');
        process.exit(1);
      }

      process.exit(0);
    });

    // If some connection keeps the server hanging, don't wait forever
    setTimeout(() => process.exit(1), 10_000).unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch(async (error) => {
  logger.error({ err: error }, 'Failed to start server');
  await prisma.$disconnect().catch(() => undefined);
  process.exit(1);
});
