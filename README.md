# InNeedFeed — Claim Calendar MVP

Restaurant Donation Marketplace (Bread & Table / Chicago pilot).

## Run locally

```bash
cd inneedfeed
npm install
npm run dev
```

Open the URL Next prints (usually http://localhost:3000).

## Demo PIN (post a need)

Default: **`2244`**

Override with `DEMO_PIN` in `.env.local`.

## What to click

1. **Home** — open needs preview  
2. **Calendar** — month groups of meal jobs  
3. Open a job → **Claim** (check diet / allergens / window)  
4. **Post a need** — charity demo form (PIN gated)  
5. **Plaques** — recognition copy stub  
6. **Bridge** — existing Grok Bot bridge status (unchanged API)

## Data

Needs persist in `data/needs.json` (created/seeded on first load). That folder is gitignored for runtime state; seeds regenerate if the file is missing.

## Vercel (later)

- Connect `bubbafrank9/inneedfeed`
- Set `DEMO_PIN` (and bridge secrets if used)
- Note: file-based JSON works on a single Node instance; for production multi-instance use a real DB (Prisma + Postgres/SQLite on disk is a fine next step)

## Integrity rails (MVP)

- Demo charity names only until vetted roster exists  
- Allergens required on post  
- One claim per need  
