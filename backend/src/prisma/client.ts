import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

prisma.$use(async (params: any, next: any) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;
  if (duration > 100) {
    logger.warn(`Slow query detected: ${params.model}.${params.action} took ${duration}ms`);
  }
  return result;
});

export default prisma;
