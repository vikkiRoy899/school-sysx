#!/bin/sh
# Runtime entrypoint for the backend container.
#
# The SQLite database lives on a Docker volume mounted at ./prisma, so the first
# thing worth checking is that the container user can actually write there.
set -e

PRISMA_DIR="${PRISMA_DIR:-/app/backend/prisma}"

if [ ! -d "$PRISMA_DIR" ]; then
  echo "[entrypoint] WARNING: $PRISMA_DIR is missing; SQLite has nowhere to write." >&2
elif [ ! -w "$PRISMA_DIR" ]; then
  echo "[entrypoint] WARNING: $PRISMA_DIR is not writable by uid $(id -u)." >&2
  echo "[entrypoint] SQLite writes will fail. Recreate the volume so it inherits" >&2
  echo "[entrypoint] ownership from the image: docker compose down -v && docker compose up -d" >&2
fi

# Hand off to CMD (or to the command overridden by docker compose).
exec "$@"
