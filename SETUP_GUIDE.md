# Setup Guide

## Prerequisites

- **Node.js 22 LTS or 24 LTS** — required (`engines: ">=22.0.0"`).
  The repo pins Node 24 in `.nvmrc` / `.node-version`; run `nvm use` (or `fnm use`) to switch.
- **npm 10+** — bundled with Node 22/24.
- Optional: **Docker** with Compose v2 for containerised deployment.

Check your runtime:

```bash
node -v    # v22.x or v24.x
npm -v     # 10.x or 11.x
```

## Local development

1. **Install dependencies** (npm workspaces — one install at the root):

   ```bash
   npm install
   ```

2. **Configure the backend environment**:

   ```bash
   cp backend/.env.example backend/.env
   ```

   Generate a real secret for anything beyond local use:

   ```bash
   node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
   ```

   | Variable | Default | Notes |
   | --- | --- | --- |
   | `DATABASE_URL` | `file:./dev.db` | Relative to `backend/prisma/` |
   | `JWT_SECRET` | — | Required in production; the server refuses to boot without it |
   | `JWT_EXPIRES_IN` | `24h` | |
   | `CORS_ORIGIN` | `*` | Comma-separated origins; set to `http://localhost:3000` locally |
   | `PORT` | `4000` | |

3. **Create and seed the database**:

   ```bash
   npm run db:generate    # prisma generate
   npm run db:push        # create schema in backend/prisma/dev.db
   npm run db:seed        # demo data (idempotent — skips if already seeded)
   ```

   Or all of it at once: `npm run setup`.

4. **Run** (separate terminals):

   ```bash
   npm run dev:backend    # http://localhost:4000 · docs at /api-docs · health at /health
   npm run dev:admin      # http://localhost:3000
   npm run dev:mobile     # Expo dev server (requires Expo Go on a device/simulator)
   ```

   The admin app reads `NEXT_PUBLIC_API_URL`; copy `frontend-admin/.env.local.example`
   to `.env.local` if your API is not on `http://localhost:4000/api/v1`.

### Demo accounts

Password for all seeded users: `admin123`

| Email | Role |
| --- | --- |
| `admin@testschool.com` | SUPER_ADMIN |
| `branch@testschool.com` | BRANCH_ADMIN |
| `teacher@testschool.com` | TEACHER |
| `parent@testschool.com` | PARENT |
| `student1@testschool.com`, `student2@testschool.com` | STUDENT |

## Production build

```bash
npm run build:backend   # tsc → backend/dist
npm run build:admin     # next build → .next/standalone
node backend/dist/index.js
```

## Docker

Both images are multi-stage and accept a `NODE_VERSION` build arg (default `24`).

```bash
docker compose up -d --build                    # Node 24 LTS
NODE_VERSION=22 docker compose up -d --build    # Node 22 LTS

docker compose logs -f backend
docker compose down                             # stop
docker compose down -v                          # stop and delete the database volume
```

| Service | Built from | Behaviour |
| --- | --- | --- |
| `migrate` | `backend/Dockerfile` → `build` stage | Runs to completion, then exits. Applies the schema with `prisma migrate deploy` if `backend/prisma/migrations/` exists, else `prisma db push`. Seeds when `SEED=true`. |
| `backend` | `backend/Dockerfile` → `runtime` stage | Slim production image: prod dependencies only, non-root `node` user, `tini` as PID 1, `no-new-privileges`. |
| `admin` | `frontend-admin/Dockerfile` → `runtime` stage | Next.js standalone server (`server.js`), non-root. |

Start-up order is enforced by health/completion conditions, so `up` alone gives you a
database with the schema applied:

```
migrate (completes) → backend (healthy) → admin
```

The interesting bits:

- **Why a separate migrate image?** The runtime image is pruned to production
  dependencies and does not ship the Prisma CLI — it is ~115 MB smaller that way. The
  `migrate` service reuses the `build` stage, which still has the CLI and `tsx`.
- **Data** lives in the named volume `backend-data`, mounted at `/app/backend/prisma`,
  so it survives rebuilds and `up --build`.
- **Configuration** comes from `.env` in the repo root (Compose loads it
  automatically): `NODE_VERSION`, `BACKEND_PORT`, `ADMIN_PORT`, `JWT_SECRET`,
  `CORS_ORIGIN`, `SEED`. See `.env.example`.
- **`NEXT_PUBLIC_API_URL` is baked in at build time** because it is inlined into the
  browser bundle — it must be an address the *browser* can reach, not the Compose
  service name. Change it and rebuild the admin image.

Load demo data into an existing stack:

```bash
docker compose run --rm -e SEED=true migrate
```

Reset everything:

```bash
docker compose down -v && docker compose up -d --build
```

### Docker development (hot reload)

```bash
npm run docker:dev
# equivalent to:
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

The overlay swaps both images to the `build` stage, bind-mounts `./backend` and
`./frontend-admin`, runs `npm run dev` (tsx watch / next dev), seeds automatically and
exposes the debugger on port 9229. It is deliberately *not* named
`docker-compose.override.yml`, so it can never be applied to a production run by
accident.

### Image details

| | Backend | Admin |
| --- | --- | --- |
| Base | `node:24-alpine` (`NODE_VERSION`) | `node:24-alpine` |
| User | `node` (non-root) | `node` (non-root) |
| PID 1 | `tini` | `init: true` from Compose |
| Healthcheck | `GET /health` | `GET /login` |
| Log rotation | `json-file`, 10 MB × 3 | `json-file`, 10 MB × 3 |
| Graceful stop | 20 s | 15 s |

## Troubleshooting

**`@prisma/client did not initialize yet`** — run `npm run db:generate`.
The Prisma CLI downloads engine binaries from `binaries.prisma.sh`; behind a strict
proxy allow-list, pre-populate `PRISMA_ENGINES_MIRROR` or run generation on a networked
machine and copy `node_modules/.prisma`.

**`JWT_SECRET must be set in production`** — the server intentionally refuses to start
with `NODE_ENV=production` and no secret. Set it in `backend/.env` or the container env.

**Port already in use** — the backend honours `PORT`, the admin app `next start -p`.

**Node version errors** — `nvm install 24 && nvm use` (or 22). Node 20 and older are
unsupported from this revision onwards (see `docs/adr/0002-node-22-24-runtime.md`).

## GitHub Repository

- **Repo**: https://github.com/vikkiRoy899/school-sysx.git
