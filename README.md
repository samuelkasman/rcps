# RCPS Monorepo

RCPS is a Turborepo-based monorepo containing a Next.js web app, an Express API, and a Prisma data layer. Packages share configuration and tooling via workspace packages.

## Stack
- Monorepo: Turborepo, pnpm workspaces
- Backend: Express (apps/api), Prisma (packages/prisma), PostgreSQL
- Frontend: Next.js (apps/web)
- Tooling: TypeScript, tsx, Biome

## Workspace layout
- `apps/web` — Next.js frontend
- `apps/api` — Express API
- `packages/prisma` — Prisma schema, client, migrations, seed
- `packages/config` — shared TS config and tooling settings

## Prerequisites
- Node.js 18+ (recommend 18 or 20) and pnpm (per root `packageManager`)
- PostgreSQL running locally (or a remote URL)

## Environment setup
1. Copy the env template and fill in values:
   - `cp env.example .env` (or `.env.local` if you prefer)
2. Ensure `DATABASE_URL` points to your Postgres instance.
   - Example: `postgresql://postgres:postgres@localhost:5432/rcps?schema=public`

## Install
From the repo root:
```bash
pnpm install
```

## Database
Generate the Prisma client (run inside `packages/prisma`):
```bash
pnpm generate
```

Run Postgres via Docker (default `DATABASE_URL` in `env.example`)
From the repo root:
```bash
docker-compose up -d
```

Apply migrations and seed (run inside `packages/prisma`):
```bash
pnpm migrate:dev
pnpm seed
pnpm studio   # browser UI
```

## Running the apps
In one terminal window:
```bash
pnpm dev
```

Or in separate terminals from the repo root:
```bash
# API (Express)
cd apps/api && pnpm dev

# Web (Next.js)
cd apps/web && pnpm dev
```
