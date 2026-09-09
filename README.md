# Compare NBN

An independent, AI-assisted NBN plan comparison website — built as an MVP
to validate the concept before scaling. See `PRD.md` for the full original
product spec this was built from.

## Philosophy

> Help consumers make better decisions using transparent data, objective
> comparison and AI-assisted explanations.

- No paid rankings. No `commission` / `affiliateValue` / `advertiserPriority`
  fields anywhere in the scoring model.
- Clear separation: **Data → Eligibility → Scoring → Ranking → AI Explanation**.
- AI never invents plan facts — it only explains what the scoring engine
  already calculated from structured data. If AI is unavailable, the
  comparison still works (mock fallback).
- All plan data currently in the database is **demo data**, clearly labelled,
  for development purposes. Replace `data/demo-plans/*.json` with verified
  real provider data before going live.

## Tech stack

Next.js (App Router) · TypeScript · React · Tailwind CSS v4 · Vercel-ready

## Getting started

```bash
npm install
cp .env.example .env.local   # optional: add OPENAI_API_KEY, NEXT_PUBLIC_GA_ID
npm run dev
```

Visit http://localhost:3000

## Project structure

```
app/                  Routes (App Router)
components/
  layout/             Header, Footer, Analytics
  ui/                 Buttons, cards, badges, contact form, etc.
  questionnaire/       Compare NBN questionnaire
  comparison/          PlanCard, ComparisonTable, RecommendationCard
lib/
  comparison/          Scoring engine, comparison engine, weights config
  ai/                  AI recommendation service (mock + optional OpenAI)
  database/            Data access layer (JSON now, swappable for a real DB)
  seo/                 Metadata helper
  analytics/           GA4 event helper
data/demo-plans/       Seed data — providers, plans, guides (ALL DEMO DATA)
types/                 Shared TypeScript types
```

## Key pages

- `/` — Home
- `/compare` — 5-step questionnaire
- `/compare/results` — Ranked recommendations + full comparison table
- `/plans/[slug]` — Plan detail page
- `/methodology` — How scoring works (weights, no-paid-ranking policy)
- `/how-it-works`, `/about`, `/guides`, `/contact`
- `/privacy`, `/terms`, `/disclaimer` — legal placeholders, **not yet
  reviewed by a lawyer**

## Scoring model

Configured in `lib/comparison/weights.ts`:

| Factor | Weight |
| --- | --- |
| Price | 30% |
| Download speed | 20% |
| Upload speed | 15% |
| Suitability for stated requirements | 15% |
| Contract flexibility | 10% |
| Features / inclusions | 10% |

Change the weights in one place — nothing else hard-codes them.

## Before going live

- [ ] Replace demo plan/provider data with real, verified data
- [ ] Legal review of `/privacy`, `/terms`, `/disclaimer`
- [ ] Wire up real email delivery in `app/api/contact/route.ts`
- [ ] Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `OPENAI_API_KEY` in
      your Vercel project's environment variables
- [ ] Connect a real database if/when the plan catalogue outgrows static JSON
