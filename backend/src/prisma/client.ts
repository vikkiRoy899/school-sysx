import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const basePrisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
  ],
});

/**
 * Slow-query logging.
 *
 * Prisma 6 removed `$use` middleware, so this is implemented with the
 * `$extends` query extension API (the supported replacement).
 */
const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      // Types for this callback come from the generated Prisma client.
      async $allOperations({ model, operation, args, query }: any) {
        const start = performance.now();
        const result = await query(args);
        const duration = performance.now() - start;

        if (duration > 100) {
          logger.warn(
            `Slow query detected: ${model}.${operation} took ${duration.toFixed(0)}ms`
          );
        }

        return result;
      },
    },
  },
});

export default prisma;
