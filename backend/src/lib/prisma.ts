import { PrismaClient } from '@prisma/client';

import { env } from '../config/env';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// Reuse the client across hot reloads in dev so we don't leak connections
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProduction ? ['error'] : ['warn', 'error'],
  });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}
