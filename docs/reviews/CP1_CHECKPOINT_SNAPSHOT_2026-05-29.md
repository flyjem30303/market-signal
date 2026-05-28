# CP1 Checkpoint Snapshot

Date: 2026-05-29

## CEO Status

```text
PROCEED_INTERNAL_ONLY
```

The project has enough Supabase and raw-market validation to continue internal
diagnostics and source readiness work. It does not have approval to switch the
public product to Supabase data or real model scores.

## Current Approved Surface

Approved:

```text
Supabase freshness metadata in local/internal runtime
Supabase raw market diagnostics
Internal raw market preview
Internal ETF source readiness view
Internal diagnostics console
Local review-gate aggregator
```

Not approved:

```text
NEXT_PUBLIC_DATA_SOURCE=supabase
Public real-data stock UI
Public mixed raw-data + mock-score UI
ETF ingestion
ETF scoring
ETF public interpretation
Real model score claims
```

## Current Gate Status

```text
npm run check:review-gates -> ok
ETF source gate -> blocked, expected
ETF due-diligence gate -> blocked, expected
Internal route exposure -> ok
TypeScript -> ok
```

## Data Status

Supabase bootstrap validation passed earlier for:

```text
stocks: 1086
daily_prices: 1083
daily_fundamentals: 1077
latest data date: 2026-05-27
source: TWSE OpenAPI
```

Current local frontend behavior:

```text
DATA_FRESHNESS_SOURCE=supabase
NEXT_PUBLIC_DATA_SOURCE=mock
```

## ETF Status

ETF schema exists in repo:

```text
etf_profiles
etf_daily_metrics
etf_holdings
```

Remote Supabase ETF schema is validated:

```text
etf_profiles: exists, 0 rows
etf_daily_metrics: exists, 0 rows
etf_holdings: exists, 0 rows
0050 / 006208: classified as ETF
```

ETF source readiness:

```text
TWSE official ETF disclosures: 61
Issuer official ETF pages: 31
Paid market data vendor: 12
```

ETF source remains blocked because:

```text
no approved source
no license review
no ingestion validation
missing expense_ratio
missing tracking_difference
missing constituent_count
```

## Role Synthesis

A / PM + Developer:

- Keep public repository source on mock.
- Next work should focus on executable gates and source validation.

B / Marketing:

- ETF coverage may be described only as internal preparation.
- No public ETF analytics claim.

C / Investment Advisor:

- ETF scoring requires ETF-specific fields and review.
- PE/PB-only ETF interpretation remains rejected.

D / Legal:

- License / redistribution review is required before ETF ingestion.
- Public mixed-data display remains blocked.

F / Product Design / UIUX:

- Internal diagnostics may continue.
- Public ETF modules should wait until fields and disclosures are approved.

E / CEO:

- Continue internal diagnostics and source due diligence.
- Do not switch public product to Supabase or real score claims.

## Next Best Step

Apply one of these controlled actions:

```text
Option A: Continue TWSE / ETFortune endpoint research for ETF source due diligence.
Option B: Continue TWSE / ETFortune endpoint research for ETF source due diligence.
Option C: Add a docs-first release checklist for moving from CP1 to CP2.
```

CEO recommendation:

```text
Option A, because remote ETF schema is now validated.
```
