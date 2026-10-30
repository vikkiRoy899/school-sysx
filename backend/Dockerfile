# syntax=docker/dockerfile:1

# Node 24 LTS by default; build with --build-arg NODE_VERSION=22 for Node 22 LTS.
ARG NODE_VERSION=24

# ------------------------------------------------------------------------ base
FROM node:${NODE_VERSION}-alpine AS base
# openssl: required by Prisma on Alpine/musl.
# tini:     PID 1 that forwards signals and reaps zombies.
RUN apk add --no-cache openssl tini
WORKDIR /app

# ------------------------------------------------------------------ full deps
# Manifests only, so this layer is cached until dependencies change.
FROM base AS deps
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend-admin/package.json ./frontend-admin/
COPY frontend-mobile/package.json ./frontend-mobile/
RUN npm ci --workspace=backend --include-workspace-root=false

# ------------------------------------------------------------------ build
# Also the image used by the one-shot `migrate` service (it keeps the Prisma CLI
# and tsx, which the slim runtime image intentionally does not ship).
FROM deps AS build
COPY backend ./backend
COPY docker ./docker
RUN npm run db:generate --workspace=backend \
 && npm run build --workspace=backend

# --------------------------------------------------------- production deps only
FROM base AS prod-deps
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend-admin/package.json ./frontend-admin/
COPY frontend-mobile/package.json ./frontend-mobile/
# @prisma/client declares `prisma` as a peer dependency, so the lockfile resolves
# the whole CLI (plus its TypeScript / esbuild / effect dependencies) into the
# production tree. The running API never calls it — the query engine it needs
# ships in node_modules/.prisma — so drop ~115 MB here. Schema changes go through
# the `migrate` service, which uses the `build` stage where the CLI exists.
RUN npm ci --workspace=backend --include-workspace-root=false --omit=dev \
 && rm -rf node_modules/prisma node_modules/typescript node_modules/@esbuild node_modules/effect \
 && rm -f node_modules/.bin/prisma node_modules/.bin/tsc node_modules/.bin/tsx

# --------------------------------------------------------------------- runtime
FROM base AS runtime

LABEL org.opencontainers.image.title="school-sysx backend" \
      org.opencontainers.image.description="School & Coaching Management System API" \
      org.opencontainers.image.source="https://github.com/vikkiRoy899/school-sysx"

ENV NODE_ENV=production \
    PORT=4000

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
# Generated Prisma client + query engine (produced by `prisma generate`).
COPY --from=build --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=node:node /app/backend/package.json ./backend/package.json
COPY --from=build --chown=node:node /app/backend/dist ./backend/dist
COPY --from=build --chown=node:node /app/backend/prisma ./backend/prisma
COPY --chown=node:node docker/runtime-entrypoint.sh /usr/local/bin/runtime-entrypoint.sh
RUN chmod +x /usr/local/bin/runtime-entrypoint.sh

WORKDIR /app/backend
USER node
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health >/dev/null 2>&1 || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/runtime-entrypoint.sh"]
CMD ["node", "dist/index.js"]
