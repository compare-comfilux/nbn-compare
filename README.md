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
- Plan data is **real and live**, sourced from the Oz Broadband Review
  public plans API (see "Data source" below) — not demo data. There is no
  single official feed of every Australian RSP's retail NBN plans (nbn co
  is wholesale-only; each retailer sets its own pricing), so this catalogue
  is real but not exhaustive.

## Tech stack

Next.js (App Router) · TypeScript · React · Tailwind CSS v4 · Vercel-ready

## Data source

Plan data comes from [Oz Broadband Review's public plans
API](https://www.ozbroadbandreview.com/plans-api.php) — free, no API key,
CC BY 4.0 licensed. Their license requires a visible, do-follow attribution
link wherever this data is shown; that's already implemented in
`components/ui/DataAttribution.tsx` (rendered in the footer and on
pages that display plan data) — **do not remove it**.

That feed does not include per-plan upload speed, modem details, or
curated "pros/cons/suitable for" copy — and no logo images. See
`lib/external/ozbroadbandReview.ts` for exactly how we derive upload
speed (parsed from the plan name where published, otherwise a flagged
estimate) and `lib/comparison/describePlan.ts` for the objective,
rule-based tags shown instead of fabricated editorial content. Full
detail on all of this is on the `/methodology` page.

**Provider logos**: `lib/providers/providerDomains.ts` holds a curated,
individually-verified list of provider name -> official domain
mappings (getting this wrong shows the wrong company's logo, so
entries are only added once confirmed, not guessed). `components/ui/ProviderLogo.tsx`
then shows a real logo fetched live from that domain — via
[logo.dev](https://www.logo.dev/) if `NEXT_PUBLIC_LOGO_DEV_KEY` is set
(free tier, better quality), otherwise via Google's public favicon
service (no key needed, lower quality). Providers without a verified
domain, or any image that fails to load, fall back to a deterministic
initials avatar rather than a broken image. To add a provider, verify
their real domain yourself and add it to the mapping.

Requests are cached via Next.js's fetch cache (`revalidate: 3600`, shared
across serverless invocations on Vercel) to stay well within the source's
300 requests/hour fair-use limit.

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
  ui/                 Buttons, cards, badges, contact form, attribution, etc.
  chat/               Floating AI chat assistant widget
  questionnaire/       Compare NBN questionnaire
  comparison/          PlanCard, ComparisonTable, RecommendationCard
lib/
  comparison/          Scoring engine, comparison engine, weights config, describePlan
  ai/                  AI recommendation service + chat assistant (mock + optional OpenAI)
  database/            Data access layer (fetches from the external API, cached)
  external/            Oz Broadband Review API client + transform (the one real data source)
  seo/                 Metadata helper
  analytics/           GA4 event helper
data/guides.ts         Editorial guide content (unrelated to the plans feed)
types/                 Shared TypeScript types
```

## Key pages

- `/` — Home
- `/compare` — two-path chooser: Search by Speed, or the 5-step questionnaire
- `/compare/by-speed` — pick an exact speed tier, skip the questionnaire
- `/compare/results`, `/compare/by-speed/results` — ranked recommendations
  + full comparison table (both dynamically rendered — never statically cached)
- `/plans/[slug]` — plan detail page (dynamically rendered, live data)
- `/methodology` — data source, scoring weights, what's estimated vs. published
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

Change the weights in one place — nothing else hard-codes them. Suitability
is computed from the customer's own questionnaire answers (household size +
usage-implied speed load) vs. each plan's real speed — see `lib/comparison/scoring.ts`.

## Before going live

- [ ] Legal review of `/privacy`, `/terms`, `/disclaimer`
- [ ] Wire up real email delivery in `app/api/contact/route.ts`
- [ ] Set `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `OPENAI_API_KEY` in
      your Vercel project's environment variables
- [ ] Consider a second/fallback plan data source if Oz Broadband Review's
      API has an outage — `PlanDataUnavailable` currently shows a graceful
      error instead of crashing the page
- [ ] Revisit the upload-speed estimation heuristic if it proves inaccurate
      for a meaningful share of plans
