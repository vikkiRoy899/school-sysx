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

Both images are multi-stage and accept a `NODE_VERSION` build arg (default `24`):

```bash
docker compose up -d --build                    # Node 24 LTS
NODE_VERSION=22 docker compose up -d --build    # Node 22 LTS

docker compose logs -f backend
docker compose exec backend npx prisma db push  # first run: create the schema
docker compose down                             # stop
```

The backend volume `backend-data` is mounted at `/app/backend/prisma`, so the SQLite
file survives rebuilds. Seeding needs dev dependencies, so run it from a local checkout
(`npm run db:seed`) against the same database file, or extend the image.

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
