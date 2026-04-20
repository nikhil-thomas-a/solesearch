# SoleSearch

> Data-driven shoe discovery. Find your perfect shoe through biomechanics-aware fit matching, real lab data, and multi-currency price tracking.

**Live demo:** [Deploy to Vercel in 60 seconds](#deploy)

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

Each signal returns a plain-English reason if positive and a warning if it's a compromise.

---

## Features

- **6-step plain-English quiz** — no jargon, wet-foot-test arch guide, UK/US/EU sizing toggle
- **40 shoes across 12 categories** — road running, trail, basketball, football, tennis, gym, hiking, walking, sneakers, work safety, healthcare, wide/orthopaedic
- **Full shoe detail pages** — 12 lab metrics with visual bars, price tracker with 7-month chart, fit guide, construction breakdown, review sentiment, similar shoes
- **Live catalogue** — filter by category, brand, price, min CoreScore; live search; sort by score/price/weight
- **Side-by-side compare** — searchable shoe picker, colour-coded score highlights, quick verdict cards
- **Multi-currency** — GBP, USD, EUR, INR, AUD, CAD — all prices stored in USD, converted at display
- **Price alerts** — per-shoe alert input wired to FastAPI backend

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind v4 + custom CSS design system |
| State | React Context (RegionContext), sessionStorage (quiz profile) |
| Backend (scaffold) | FastAPI (Python 3.11+) |
| Database (ready) | PostgreSQL + pgvector schema in `backend/schema.sql` |
| Recommendation engine | Pure TypeScript, client-side, `src/lib/recommend.ts` |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  Homepage
│   ├── catalogue/page.tsx        Browse + filter (live)
│   ├── shoes/[slug]/page.tsx     Shoe detail (full, all sections)
│   ├── compare/page.tsx          3-slot comparison with shoe picker
│   ├── finder/page.tsx           6-step quiz
│   └── finder/results/page.tsx  Live ranked results with explanations
├── components/
│   ├── layout/Navbar.tsx         Dark nav + region/currency switcher
│   └── ui/  CategoryCard, Pill, ScoreBar, ScoreRing
├── data/shoes.ts                 40-shoe dataset (all categories)
├── lib/
│   ├── recommend.ts              9-signal recommendation engine
│   ├── regionContext.tsx         Global currency/region context
│   └── utils.ts                 Helpers
└── types/index.ts               Full TypeScript model
backend/
├── main.py                       FastAPI scaffold (all routes stubbed)
└── schema.sql                    PostgreSQL + pgvector schema
```

---

## Getting started

```bash
npm install
npm run dev        # → localhost:3000
```

Backend (optional — frontend works standalone):
```bash
pip install fastapi uvicorn psycopg2-binary python-dotenv
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/solesearch" > backend/.env
psql -U postgres -d solesearch -f backend/schema.sql
python backend/main.py   # → localhost:8000/docs
```

---

## Deploy to Vercel

```bash
npm i -g vercel && vercel
```

Or: vercel.com → New Project → Import from GitHub → deploy in ~60 seconds.

---

## Roadmap

- [x] Phase 1 — UI foundations (shoe detail, design system)
- [x] Phase 2 — Project scaffold (Next.js, TypeScript, Tailwind v4)
- [x] Phase 3 — Recommendation engine (9-signal scoring, plain-English results)
- [x] Phase 4 — Full dataset (40 shoes, 12 categories)
- [x] Phase 5 — Multi-currency (GBP/USD/EUR/INR/AUD/CAD)
- [ ] Phase 6 — Supabase integration (live data from `backend/schema.sql`)
- [ ] Phase 7 — Price scraper (public retailer spec pages)
- [ ] Phase 8 — RunRepeat data partnership (lab data licensing)
- [ ] Phase 9 — User auth + wishlists (NextAuth.js)
- [ ] Phase 10 — AI explanations (Claude API for richer match reasons)

---

## Data philosophy

Lab measurements (weight, drop, stack heights, midsole hardness, energy return, toebox dimensions) are sourced from published brand spec sheets, Running Warehouse's independently measured specs, and aggregated expert review data. Scores are editorial aggregates. No brand payments. Every data point is citable.

The goal is a data partnership with [RunRepeat](https://runrepeat.com) — their lab data + our discovery and recommendation layer.

---

*Built by Nikhil Thomas A · [github.com/nikhil-thomas-a](https://github.com/nikhil-thomas-a)*
