# syntax=docker/dockerfile:1

# Node 24 LTS by default; build with --build-arg NODE_VERSION=22 for Node 22 LTS.
ARG NODE_VERSION=24

# ---------------------------------------------------------------------- build
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/
COPY frontend-admin/package.json ./frontend-admin/
COPY frontend-mobile/package.json ./frontend-mobile/

RUN npm ci --workspace=frontend-admin --include-workspace-root=false

COPY frontend-admin ./frontend-admin

# Inlined into the client bundle at build time — must be reachable from the browser.
ARG NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build --workspace=frontend-admin

# -------------------------------------------------------------------- runtime
FROM node:${NODE_VERSION}-alpine AS runtime

LABEL org.opencontainers.image.title="school-sysx admin" \
      org.opencontainers.image.description="School & Coaching Management System dashboard" \
      org.opencontainers.image.source="https://github.com/vikkiRoy899/school-sysx"

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1

# `output: 'standalone'` with a monorepo trace root emits ./frontend-admin/server.js
COPY --from=build --chown=node:node /app/frontend-admin/.next/standalone ./
COPY --from=build --chown=node:node /app/frontend-admin/.next/static ./frontend-admin/.next/static

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/login >/dev/null 2>&1 || exit 1

CMD ["node", "frontend-admin/server.js"]
