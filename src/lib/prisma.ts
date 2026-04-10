import { loadEnvConfig } from '@next/env';
import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

if (!process.env.DATABASE_URL) {
  loadEnvConfig(process.cwd());
}

// ---------------------------------------------------------------------------
// Prisma Middleware — logs all queries and catches + reports errors through pino
// ---------------------------------------------------------------------------
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  extendedPrisma: ReturnType<typeof createExtendedClient> | undefined;
};

function createExtendedClient(base: PrismaClient) {
  return base.$extends({
    name: 'query-logger',
    query: {
      async $allOperations({ model, operation, args, query }) {
        const start = Date.now();
        try {
          const result = await query(args);
          const duration = Date.now() - start;
          if (duration > 500) {
            logger.warn(
              { model, operation, durationMs: duration },
              'Slow Prisma query detected'
            );
          }
          return result;
        } catch (error) {
          logger.error(
            { model, operation, args, error, durationMs: Date.now() - start },
            'Prisma operation failed'
          );
          throw error;
        }
      },
    },
  });
}

// Base client only — needed by PrismaAdapter
const base =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [],
    ...(process.env.DATABASE_URL
      ? {
          datasources: {
            db: { url: process.env.DATABASE_URL },
          },
        }
      : {}),
  });

// Extended client with query logging middleware
export const prisma =
  globalForPrisma.extendedPrisma ?? createExtendedClient(base);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = base;
  globalForPrisma.extendedPrisma = prisma;
}

// Export base separately for PrismaAdapter (typed correctly)
export { base as basePrismaClient };

export default prisma;
