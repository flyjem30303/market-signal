# CP1 Data Trust Checkpoint

Date: 2026-05-28

Trigger:

- New TWSE stock master data source.
- New latest daily price / valuation ingestion script.
- New global-ready stock namespace.
- New market exchange registry.
- Next likely work is Supabase setup or repository implementation.

## A / PM + Developer

Current pipeline is repeatable enough for a first database bootstrap:

- `npm run fetch:stocks`
- `npm run seed:markets`
- `npm run seed:stocks`
- `npm run fetch:daily-market`
- `npm run db:bootstrap`

The repo now has a clean bootstrap path and Git checkpoints. The biggest
engineering risk is not schema creation; it is switching the UI from synchronous
mock repository to real Supabase queries. That likely requires either async
server-side loaders or a separate read model.

A recommends:

- Proceed to create Supabase project and run `supabase/bootstrap.sql`.
- Do not switch `NEXT_PUBLIC_DATA_SOURCE=supabase` yet.
- First build a small Supabase verification script or server-only smoke test.
- Keep mock UI active until repository query shape is proven.

## B / Marketing

The data now supports a stronger SEO foundation because stock master coverage is
no longer limited to the original hand-picked symbols. However, current data is
still too thin for public SEO expansion:

- Stock pages can list many symbols later, but content depth is still mock.
- Industry values are official TWSE codes, not user-friendly names.
- Latest prices and valuation are useful, but no historical trend yet.

B asks C and A to prioritize:

- Industry code mapping before broad SEO page generation.
- A clear user-facing label for data freshness.
- Do not index thousands of pages until real page content is credible.

## C / Investment Advisor

The current data improves trust but is not enough for public model scoring.

Positive:

- Sources are official TWSE OpenAPI.
- Daily price and valuation fields are useful for first real data layer.
- `country + exchange + symbol` prevents future global symbol collision.

Concerns:

- Daily data is latest snapshot only, not historical series.
- No source attribution table or per-record source metadata yet.
- No trading calendar table yet.
- No stale-data policy is implemented in code.
- No data quality score is calculated from real data yet.
- Industry codes are not mapped to meaningful sectors.

C recommends:

- Proceed with database bootstrap.
- Require a `data_runs` or equivalent ingestion log before scheduled updates.
- Do not show real scores publicly until historical data and scoring evidence exist.

## D / Legal

The project is still within a safer zone because it uses official public market
data and keeps UI in mock mode. Legal risk rises when users see real prices next
to model scores and commentary.

D warns:

- Real market data plus health / risk labels can be perceived as investment
  advice if freshness and limitations are unclear.
- Broad SEO pages must not imply complete market coverage if only TWSE is active.
- Global placeholders such as NASDAQ / NYSE must remain inactive and not be
  marketed as supported markets.

D requires before public real-data release:

- Visible data freshness.
- Clear "information only, not investment advice" language near score areas.
- No broker / affiliate CTA adjacent to scores.
- Region-specific review before non-TW markets become active.

## F / Product Design / UIUX

F agrees with not switching UI to real data immediately. If the product exposes
real prices, users must be able to quickly answer:

- What date is this data from?
- Is this complete or partial?
- Which market / currency / timezone is this?
- Is the score real or still mock?

F recommends:

- Add a compact data-quality / freshness strip before full Supabase UI switch.
- Keep it near the page header or score area, but not as a large warning block.
- Avoid cluttering the first screen with raw source text.
- Use consistent labels for market, exchange, currency, and update time.

## Role Conflicts

- B wants broader SEO coverage from 1086 symbols, while C/D warn that real content
  and disclosure are not ready.
- A wants to validate Supabase wiring soon, while F warns against exposing partial
  data in the main UI before freshness labels exist.
- E wants long-term global optionality, while A warns not to overbuild global
  features before TWSE data trust is proven.

## E / CEO Synthesis

The project is still on the right path. The latest work increased future
optionality without abandoning the Taiwan wedge.

CEO decision:

```text
REVISE
```

This does not mean the previous work was wrong. It means the next implementation
slice must be adjusted before proceeding to full Supabase repository integration.

CEO will not approve switching the app UI to Supabase data yet.

CEO approves creating a Supabase project and running bootstrap SQL, but only as
a database validation step. The UI must remain on mock data until data freshness,
source attribution, and repository query shape are verified.

## Required Adjustments

Before `NEXT_PUBLIC_DATA_SOURCE=supabase` can be used:

1. Add an ingestion run log design, such as `data_runs`.
2. Add source / freshness metadata expectations to the data docs.
3. Create a Supabase validation step that checks:
   - market exchange count
   - stock count
   - latest price count
   - latest fundamental count
   - latest trade dates
4. Define UI data freshness display requirements.
5. Keep global markets other than TWSE as inactive placeholders.

Follow-up:

- Data freshness / source attribution UI requirements are now tracked in
  `docs/DATA_FRESHNESS_UI.md`.

## Next Implementation Slice

Approved next slice:

```text
Add data_runs schema and Supabase validation workflow.
```

Not approved yet:

```text
Switch UI repository to Supabase.
Index broad real stock pages.
Show real model scores.
Add non-TW markets as active coverage.
```

## Decision

```text
REVISE
```

Proceed only with database validation infrastructure, not live UI switching.
