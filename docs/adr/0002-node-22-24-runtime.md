# ADR-0002: Node.js 22 / 24 runtime baseline

**Date**: 2026-10-30
**Status**: accepted
**Supersedes (in part)**: ADR-0001 — stack and toolchain versions only; the
architecture decisions in ADR-0001 still stand.

## Context

The project was scaffolded against a Node 20-era toolchain:

- root `engines` allowed `>=20.0.0` and the Dockerfiles used `node:20-alpine`;
- Prisma 5.10 was pinned, which predates official Node 22/24 support;
- TypeScript was pinned at 5.4/5.5, which cannot emit the `with { type: 'json' }`
  import attributes that the ESM backend relies on at runtime;
- `@types/node` resolved to the Node 20 API surface;
- the frontend images referenced a `pnpm-lock.yaml` that never existed, and the
  backend image assumed a lockfile inside `backend/` rather than the workspace root.

Node 20 reached end-of-life in 2026, so the baseline must move.

## Decision

Target **Node 22 LTS as the floor and Node 24 LTS as the default**.

1. `engines.node` is `">=22.0.0"` in the root and in every workspace.
2. `.nvmrc` and `.node-version` pin `24`; both Docker images take a
   `NODE_VERSION` build arg defaulting to `24` (`NODE_VERSION=22` for the other LTS).
3. Toolchain: TypeScript 5.9, `@types/node` 22 (the type surface of the *minimum*
   supported runtime), `tsx` 4 for the dev loop.
4. **Prisma 6.19** (`@prisma/client` 6.19). Prisma 6 declares `node >= 18.18`, covers
   both LTS lines and keeps the existing `prisma-client-js` generator and schema.
   Prisma 7 (`^20.19 || ^22.12 || >=24`) was rejected for now: it requires the
   `prisma-client` generator with a mandatory output path plus a driver adapter,
   which is a schema/architecture migration rather than a runtime bump.
   `$use` middleware — removed in Prisma 6 — is replaced with a `$extends` query
   extension in `backend/src/prisma/client.ts`.
5. Express stays on 4.x. Express 5 changes routing semantics (wildcard params) and
   buys nothing for this runtime move; the 404 handler was written in a
   version-agnostic form so the upgrade stays a two-line change.
6. Next.js stays on the 14.2 line (latest patch). Its `engines` (`>=18.17`) cover
   Node 22/24. Moving to Next 15/16 is a framework upgrade with React 19 implications
   and is tracked separately.
7. Expo SDK 51 is retained for the mobile app; it installs and type-checks on Node 22.
   SDK 54 is the recommended upgrade for the React Native side and is tracked
   separately.
8. CI (`.github/workflows/ci.yml`) runs the full install → generate → typecheck →
   build pipeline on **both Node 22 and Node 24**.

## Consequences

### Positive

- Supported, patched runtime on both active LTS lines; `.nvmrc` removes ambiguity.
- `import ... with { type: 'json' }` (Node ≥ 20.10, standard in 22+) is emitted by
  TypeScript 5.9 instead of being silently mishandled.
- Docker builds work from the workspace root, so `npm ci` sees the real lockfile.
- A single Node floor is enforced in three places (engines, `.nvmrc`, Docker args).

### Negative / risks

- Prisma engine binaries are downloaded at install/generate time; air-gapped builds
  need a mirror.
- Consumers on Node 20 now get an `EBADENGINE` warning and an unsupported setup.
- Two JS engines are now in play for contributors (TypeScript 5.9 locally, Node's own
  type stripping is *not* used — `tsx` remains the dev runner because the codebase
  imports with `.js` specifiers, which Node's stripper does not rewrite).

### Verification

- `tsc` builds backend + admin + mobile on Node 22.22.
- `next build` produces a standalone server bundle.
- The compiled backend boots on Node 22 and serves `/health`, `/api-docs` and the
  versioned API (`/api/v1/...`) including 401/404 handling.
- CI repeats the pipeline on Node 22 and 24.
