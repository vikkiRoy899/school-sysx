# syntax=docker/dockerfile:1

# Node 24 LTS by default; build with --build-arg NODE_VERSION=22 for Node 22 LTS.
ARG NODE_VERSION=24

# ---------------------------------------------------------------- deps + build
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

# Prisma needs OpenSSL on Alpine.
RUN apk add --no-cache openssl

# Monorepo manifests only, so this layer caches on dependency changes.
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend-admin/package.json ./frontend-admin/
COPY frontend-mobile/package.json ./frontend-mobile/

RUN npm ci --workspace=backend --include-workspace-root=false

COPY backend ./backend

RUN npm run db:generate --workspace=backend \
 && npm run build --workspace=backend

# --------------------------------------------------------- production deps only
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend-admin/package.json ./frontend-admin/
COPY frontend-mobile/package.json ./frontend-mobile/
RUN npm ci --workspace=backend --include-workspace-root=false --omit=dev

# --------------------------------------------------------------------- runtime
FROM node:${NODE_VERSION}-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production \
    PORT=4000

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
# Generated Prisma client (emitted by `prisma generate` in the build stage).
COPY --from=build --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=node:node /app/backend/package.json ./backend/package.json
COPY --from=build --chown=node:node /app/backend/dist ./backend/dist
COPY --from=build --chown=node:node /app/backend/prisma ./backend/prisma

WORKDIR /app/backend
USER node
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health >/dev/null 2>&1 || exit 1

CMD ["node", "dist/index.js"]
