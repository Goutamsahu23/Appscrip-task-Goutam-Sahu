import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function main() {
  await prisma.$connect();
  console.log('Database connected');

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  });

  function shutdown(signal: string) {
    console.log(`${signal} received, shutting down`);

    server.close(async (err) => {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('Error while disconnecting from database', disconnectError);
      }

      if (err) {
        console.error('Error while closing server', err);
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
  console.error('Failed to start server', error);
  await prisma.$disconnect().catch(() => undefined);
  process.exit(1);
});
