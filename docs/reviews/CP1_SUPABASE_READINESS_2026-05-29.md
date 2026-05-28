# CP1 Follow-up: Supabase Readiness

Date: 2026-05-29

Trigger:

- Supabase project is created.
- Bootstrap SQL has run successfully.
- `npm run db:validate` passed.
- `npm run db:freshness` passed.
- `npm run db:raw-market` passed.

## A / PM + Developer

A confirms the database is ready for a narrow runtime integration:

- row counts meet expected minimums
- `data_runs` is populated
- freshness read path returns `complete`
- raw market read path can load `TW/TWSE/2330`

A recommends enabling only `DATA_FRESHNESS_SOURCE=supabase` in local/internal
runtime. Do not switch `NEXT_PUBLIC_DATA_SOURCE`.

## B / Marketing

B approves showing real freshness metadata because it improves trust and does
not create new SEO claims.

B does not approve broad stock page indexing or public real-data marketing.

## C / Investment Advisor

C approves real freshness labels. The labels clarify source, market, date,
currency, and timezone.

C does not approve real model scores. Current score output remains mock.

## D / Legal

D approves real freshness metadata because it reduces ambiguity. Legal still
requires visible distinction between real raw data, freshness metadata, and mock
model interpretation.

D does not approve switching the main repository or presenting real scores.

## F / Product Design / UIUX

F approves the current compact freshness strip as an acceptable first UI surface.
It should stay close to briefing and stock-page score/quote areas.

F recommends avoiding larger warning blocks unless freshness becomes partial,
stale, or unavailable.

## E / CEO Synthesis

CEO approves a narrow proceed:

```text
PROCEED
```

Only enable Supabase freshness metadata. Keep all main market signals, scores,
news, commentary, and public stock content on mock repository until a later
checkpoint.

## Required Adjustments

1. Set local/internal `DATA_FRESHNESS_SOURCE=supabase`.
2. Keep `NEXT_PUBLIC_DATA_SOURCE=mock`.
3. Verify `/briefing` and `/stocks/2330` still render.
4. Keep `.env.local` ignored and uncommitted.
5. Record validation results and decision.

## Implementation Note

- Completed: local `.env.local` uses `DATA_FRESHNESS_SOURCE=supabase`.
- Verified: `/briefing` renders Supabase freshness from `TWSE OpenAPI`.
- Verified: `/stocks/2330` renders Supabase freshness from `TWSE OpenAPI`.
- Still enforced: `NEXT_PUBLIC_DATA_SOURCE=mock`.

## Not Approved

```text
NEXT_PUBLIC_DATA_SOURCE=supabase
Real model scores
Public mixed-data stock UI
SEO expansion based on Supabase data
Non-TW active market launch
```
