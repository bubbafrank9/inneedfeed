# InNeedFeed — Chicago v0 (Claim → Fulfill → Confirm)

Restaurant Donation Marketplace (Bread & Table / Chicago pilot).

## Run locally

```bash
cd inneedfeed
npm install
npm run dev
```

Open the URL Next prints (usually http://localhost:3000).

## Demo PIN (post a need + charity confirm)

Default: **`2244`**

Override with `DEMO_PIN` in `.env.local`.

Used for:

1. **Post a need** (charity demo gate)
2. **Confirm fulfillment** on a need that is already marked fulfilled

## Lifecycle

```
open → claimed → fulfilled → confirmed
         ↑           ↑            ↑
      restaurant   restaurant   charity (+ PIN)
```

- **Claim** — one restaurant per need; diet / allergens / window checkboxes required
- **Mark fulfilled** — restaurant says trays were delivered
- **Confirm** — charity PIN confirms receipt; **only then** it counts for plaques & scoreboard
- `cancelled` exists in the type system for later ops; not exposed in seed UI yet

## What to click

1. **Home** — open needs + confirm-before-plaque note + scoreboard link  
2. **Calendar** — month groups of meal jobs  
3. Open a job → **Claim** → **Mark fulfilled** → **Confirm** (PIN)  
4. **Post a need** — charity demo form (PIN gated)  
5. **Scoreboard** — Chicago aggregates (confirmed meals, headcount, restaurants, charities, open/claimed)  
6. **Plaques** — tier copy (thresholds TBD) + live restaurant leaderboard from confirmed meals  
7. **Bridge** — existing Grok Bot bridge status (unchanged; do not patch bridge routes)

## Recognition tiers (constants — labeled TBD)

| Tier | Confirmed meals (TBD) |
|------|------------------------|
| Neighbor | ≥ 1 |
| Table Steward | ≥ 5 |
| City Champion | ≥ 10 |

Defined in `lib/marketplace/recognition.ts`.

## Data

Needs persist in `data/needs.json` (created/seeded on first load). That folder is gitignored for runtime state; seeds regenerate if the file is missing.

Seed charity names are clearly fictional `(demo)` placeholders — not real orgs.

## Vercel (later)

- Connect `bubbafrank9/inneedfeed`
- Set `DEMO_PIN` (and bridge secrets if used)
- Note: file-based JSON works on a single Node instance; for production multi-instance use a real DB

## Integrity rails (MVP)

- Demo charity names only until vetted roster exists  
- Allergens required on post  
- One claim per need  
- Recognition / scoreboard count **confirmed** only — never claim-only  
