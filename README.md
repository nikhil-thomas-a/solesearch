# SoleSearch

> Data-driven shoe discovery. Find your perfect shoe through biomechanics-aware fit matching, real lab data, and multi-currency price tracking.

**🔗 Live site: [solesearch-one.vercel.app](https://solesearch-one.vercel.app)**

| | |
|---|---|
| **Quiz** | [solesearch-one.vercel.app/finder](https://solesearch-one.vercel.app/finder) |
| **Catalogue** | [solesearch-one.vercel.app/catalogue](https://solesearch-one.vercel.app/catalogue) |
| **Compare** | [solesearch-one.vercel.app/compare](https://solesearch-one.vercel.app/compare) |

---

## What it does

SoleSearch is a full-stack shoe discovery platform that matches users to shoes based on their foot shape, body weight, biomechanics, and use case — not brand sponsorships or paid placement.

### The fit engine (9 signals, 0–100 match score)

| Signal | Weight | What it measures |
|--------|--------|-----------------|
| Category fit | 25% | Does the shoe match the intended use? |
| Toebox width | 18% | mm measurement vs user's foot width |
| Cushioning | 15% | Midsole hardness (Shore C) + stack height vs preference + body weight |
| Arch support | 12% | neutral / stability / motion-control vs foot type |
| Budget | 10% | Price vs budget, 20% grace window |
| Injury history | 8% | Per-condition rules (plantar fasciitis, Achilles, bunions, knee pain…) |
| Durability | 5% | Durability score weighted by weekly km |
| Weight | 4% | Grams vs activity intensity |
| Heel drop | 3% | mm vs foot strike pattern |

Each signal returns a plain-English reason if positive and a warning if it's a compromise. The full engine is in [`src/lib/recommend.ts`](src/lib/recommend.ts) — 394 lines, fully documented.

---

## Features

- **6-step plain-English quiz** — no jargon, wet-foot-test arch guide, UK/US/EU sizing toggle
- **67 shoes across 14 categories** — road running, trail, basketball, football, tennis, gym, hiking, walking, sneakers, boots, kids, work safety, healthcare, wide/orthopaedic
- **Full shoe detail pages** — 12 lab metrics with visual bars, 7-month price chart, fit guide, construction breakdown, review sentiment, similar shoes
- **Live catalogue** — filter by category, brand, price, min CoreScore; live search; sort by score/price/weight
- **Side-by-side compare** — searchable picker across all 67 shoes, colour-coded score highlights, quick verdict cards
- **Multi-currency** — USD (default), GBP, EUR, INR, AUD, CAD — all prices stored in USD, converted at display via React Context
- **Zero dependencies on external APIs** — entire recommendation engine runs client-side, no backend required to demo

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind v4 + custom CSS design system (dark theme) |
| State | React Context (RegionContext for currency), sessionStorage (quiz profile) |
| Recommendation engine | Pure TypeScript, client-side, `src/lib/recommend.ts` |
| Backend (scaffold) | FastAPI (Python 3.11+) — stubbed routes, ready to wire |
| Database (ready) | PostgreSQL + pgvector schema in `backend/schema.sql` |
| Hosting | Vercel (auto-deploys from `main` branch) |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  Homepage (counts pull from real data)
│   ├── catalogue/page.tsx        Browse + filter (live, client-side)
│   ├── shoes/[slug]/page.tsx     Full shoe detail (6 sections)
│   ├── compare/page.tsx          3-slot comparison with searchable picker
│   ├── finder/page.tsx           6-step quiz
│   └── finder/results/page.tsx  Live ranked results with explanations
├── components/
│   ├── layout/Navbar.tsx         Dark nav + region/currency dropdown
│   └── ui/  CategoryCard, Pill, ScoreBar, ScoreRing
├── data/
│   └── shoes.ts                 67-shoe dataset across 14 categories
├── lib/
│   ├── recommend.ts              9-signal recommendation engine (394 lines)
│   ├── regionContext.tsx         Global currency/region React Context
│   └── utils.ts                 Helpers (scoreColor, heelDropLabel, softnessLabel)
└── types/index.ts               Full TypeScript model (Shoe, FootProfile, Recommendation)
backend/
├── main.py                       FastAPI scaffold (all routes stubbed, ready to wire)
└── schema.sql                    PostgreSQL + pgvector schema
```

---

## Getting started locally

```bash
git clone https://github.com/nikhil-thomas-a/solesearch-app
cd solesearch-app
npm install
npm run dev
# → http://localhost:3000
```

No environment variables required — the frontend works fully standalone.

**Backend (optional):**
```bash
pip install fastapi uvicorn psycopg2-binary python-dotenv
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/solesearch" > backend/.env
psql -U postgres -d solesearch -f backend/schema.sql
python backend/main.py
# → http://localhost:8000/docs
```

---

## Deploying to Vercel

The site deploys automatically from the `main` branch via Vercel's GitHub integration.

**First-time setup:**
1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. Vercel auto-detects Next.js — no configuration needed
4. Click Deploy → live in ~60 seconds

**Or via CLI:**
```bash
npm i -g vercel
vercel
```

**Custom domain:** Vercel dashboard → Settings → Domains → Add your domain.

Every push to `main` triggers an automatic redeploy. Pull request previews are created automatically.

---

## Data

Lab measurements (weight, drop, stack heights, midsole hardness, energy return %, toebox dimensions, breathability, grip scores) are sourced from:

- Published brand spec sheets
- Running Warehouse's independently measured specs
- Aggregated expert review data from major shoe review publications

Scores are editorial aggregates. No brand payments influence any score.

**Goal:** A data partnership with [RunRepeat](https://runrepeat.com) — their physical lab measurements (30+ metrics per shoe, cut-open testing, durometer readings) powering this recommendation engine.

---

## Roadmap

- [x] Phase 1 — UI foundations (shoe detail, design system, dark theme)
- [x] Phase 2 — Project scaffold (Next.js 16, TypeScript, Tailwind v4)
- [x] Phase 3 — Recommendation engine (9-signal scoring, plain-English results)
- [x] Phase 4 — Full dataset (67 shoes, 14 categories)
- [x] Phase 5 — Multi-currency (USD/GBP/EUR/INR/AUD/CAD via React Context)
- [x] Phase 6 — Vercel deployment with auto-deploy from GitHub
- [ ] Phase 7 — Supabase integration (replace static data with live DB)
- [ ] Phase 8 — RunRepeat data partnership (lab data licensing)
- [ ] Phase 9 — Affiliate links (Nike, ASICS, Running Warehouse, Zappos)
- [ ] Phase 10 — User auth + wishlists (NextAuth.js)
- [ ] Phase 11 — AI match explanations (Claude API)

---

*Built by Nikhil Thomas A · [github.com/nikhil-thomas-a](https://github.com/nikhil-thomas-a)*
