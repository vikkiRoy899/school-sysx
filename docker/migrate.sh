#!/bin/sh
# One-shot schema task for the Docker stack.
#
# Runs in the `build` image (which has the Prisma CLI and tsx), applies the
# schema to the mounted SQLite volume, optionally seeds demo data, then exits.
#
#   docker compose run --rm migrate                 # schema only
#   docker compose run --rm -e SEED=true migrate    # schema + demo data
set -eu

cd "$(dirname "$0")/../backend"

echo "[migrate] database: ${DATABASE_URL:-file:./dev.db}"

# Use real migrations when they exist; otherwise sync the schema directly.
if [ -d prisma/migrations ]; then
  echo "[migrate] running prisma migrate deploy"
  npx prisma migrate deploy
else
  echo "[migrate] no migrations found — running prisma db push"
  npx prisma db push --skip-generate
fi

if [ "${SEED:-false}" = "true" ]; then
  echo "[migrate] seeding demo data"
  npx tsx prisma/seed.ts
fi

echo "[migrate] done"
