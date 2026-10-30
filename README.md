# School & Coaching Management System

Multi-tenant management platform for schools and coaching centres: institutions, branches,
students, staff, attendance, fees, exams, timetables and announcements.

| Package | Stack | Purpose |
| --- | --- | --- |
| `backend/` | Express 4 + TypeScript + Prisma 6 (SQLite) | REST API, JWT auth, RBAC |
| `frontend-admin/` | Next.js 14 (App Router) + Tailwind | Super admin / branch admin / teacher dashboard |
| `frontend-mobile/` | Expo SDK 51 (React Native) | Student & parent portal |

## Requirements

- **Node.js 22 LTS or 24 LTS** (`engines: ">=22.0.0"`) — Node 20 is no longer supported.
- **npm 10+** (ships with Node 22/24).
- No database server needed: the default datasource is SQLite.

The repository pins Node 24 via `.nvmrc` / `.node-version`:

```bash
nvm use          # → Node 24
```

## Quick start

> **npm 11.16+ / npm 12:** dependency install scripts are blocked unless allowlisted.
> The root `package.json` already ships the `allowScripts` entry, so a plain install
> works — if you see `install scripts blocked`, see
> [Troubleshooting](SETUP_GUIDE.md#troubleshooting).

```bash
npm install                 # installs all three workspaces (hoisted to ./node_modules)
cp backend/.env.example backend/.env
npm run db:generate         # generate the Prisma client
npm run db:push             # create the SQLite schema
npm run db:seed             # demo institution, users, fees, exams, timetable

npm run dev:backend         # http://localhost:4000  (API docs at /api-docs)
npm run dev:admin           # http://localhost:3000
```

`npm run setup` chains install → generate → push → seed.

Demo logins (password `admin123`): `admin@testschool.com` (SUPER_ADMIN),
`branch@testschool.com`, `teacher@testschool.com`, `parent@testschool.com`,
`student1@testschool.com`, `student2@testschool.com`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev:backend` / `dev:admin` / `dev:mobile` | Start one workspace in watch mode |
| `npm run build:backend` / `build:admin` | Compile the backend / build the Next.js app |
| `npm run typecheck` | `tsc --noEmit` across every workspace |
| `npm run db:generate` / `db:push` / `db:seed` / `db:studio` | Prisma lifecycle |
| `npm run test` | Vitest (no suites are committed yet) |

## Docker

```bash
docker compose up -d --build                   # Node 24 images
NODE_VERSION=22 docker compose up -d --build   # Node 22 images
docker compose run --rm -e SEED=true migrate   # load demo data
docker compose down                            # add -v to wipe the database
```

Admin → <http://localhost:3000>, API → <http://localhost:4000>.

| Service | Image | Purpose |
| --- | --- | --- |
| `migrate` | `backend` **build** stage | One-shot: `prisma migrate deploy` (or `db push`), optional seed |
| `backend` | `backend` **runtime** stage | Slim, non-root, tini, prod deps only |
| `admin` | `frontend-admin` **runtime** stage | Next.js standalone server |

The API waits for `migrate` to finish and the dashboard waits for the API to be
healthy, so a plain `up` leaves you with a working, seeded-capable stack — no
manual `prisma db push` step.

**Hot-reload development** (bind mounts + `tsx watch` + `next dev`):

```bash
npm run docker:dev      # docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Both Dockerfiles are multi-stage and take a `NODE_VERSION` build arg (default `24`).
Ports and the Node tag can be overridden via `.env` (see `.env.example`).

## Documentation

- [`SETUP_GUIDE.md`](SETUP_GUIDE.md) — detailed setup and troubleshooting
- [`docs/adr/`](docs/adr/) — architecture decision records (stack, Node runtime)
- [`docs/api/openapi.yaml`](docs/api/openapi.yaml) — API contract
- [`plans/`](plans/) — original project plan
