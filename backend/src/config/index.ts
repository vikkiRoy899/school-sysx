import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const DEV_JWT_SECRET = 'dev-only-insecure-secret-change-me';

if (!process.env.JWT_SECRET) {
  if (isProduction) {
    throw new Error('JWT_SECRET must be set in production');
  }
  console.warn('[config] JWT_SECRET not set — using an insecure development default.');
}

export const config = {
  port: Number.parseInt(process.env.PORT || '4000', 10),
  nodeEnv,
  isProduction,
  jwtSecret: process.env.JWT_SECRET || DEV_JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  // SQLite by default; override with DATABASE_URL for PostgreSQL.
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  // Comma-separated list of allowed origins, or '*' for local development.
  corsOrigin: process.env.CORS_ORIGIN || '*',
} as const;
