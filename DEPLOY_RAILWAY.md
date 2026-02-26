# Simple Production Deployment (Railway)

This repo is configured for the easiest stable setup:
- One Railway web service running **both** Next.js and the Yjs WebSocket server
- One Railway PostgreSQL database
- Auto build/start commands via `nixpacks.toml`

## What is already done in code
- Added a combined production server: `server/combined-server.js`
- Added scripts:
  - `npm run start:combined`
  - `npm run start:railway` (runs `prisma db push` then starts app)
- Added `nixpacks.toml` so Railway auto-runs install/build/start
- WebSocket client now defaults to same-origin `/ws` when `NEXT_PUBLIC_WS_URL` is not set
- Prisma datasource set to PostgreSQL

## Intervention required from you
You only need cloud-account actions:
1. Push this repo to GitHub.
2. Create a Railway project from the repo.
3. Add a Railway PostgreSQL service.
4. Set 3 env vars in Railway (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`).

Everything else is already prepared.

## Step-by-step

### 1) Push code
```bash
cd ~/Documents/Personal/Projects/AI-ML/Collaborative-Text-Editor
git add .
git commit -m "Simplify deployment: combined server + Railway-ready config"
git push
```

### 2) Create Railway project
- Railway -> `New Project` -> `Deploy from GitHub repo`
- Select this repository

### 3) Add PostgreSQL
- In the same Railway project, add a `PostgreSQL` service

### 4) Set environment variables (app service)
- `DATABASE_URL` = value from Railway PostgreSQL service
- `NEXTAUTH_SECRET` = output of `openssl rand -base64 32`
- `NEXTAUTH_URL` = your Railway app public URL (`https://...`)

Optional:
- `NEXT_PUBLIC_WS_URL` can stay unset (app auto-uses same-origin `/ws`)

### 5) Deploy + verify
- Trigger/restart deploy after env vars are saved
- Health endpoint: `/healthz`
- Smoke test:
  - Register user
  - Create document
  - Open same doc in second browser and verify real-time sync

## Local development (after PostgreSQL switch)
Use local Postgres at `postgresql://postgres:postgres@localhost:5432/collabdocs?schema=public`

Quick local DB with Docker:
```bash
docker run --name collabdocs-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=collabdocs \
  -p 5432:5432 -d postgres:16-alpine
```

Then:
```bash
cp .env.example .env
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npm run dev:all
```
