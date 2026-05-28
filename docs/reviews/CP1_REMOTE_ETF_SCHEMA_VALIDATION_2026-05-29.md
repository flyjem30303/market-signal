# CP1 Follow-up: Remote ETF Schema Validation

Date: 2026-05-29

Trigger:

- ETF schema migration exists in repo.
- The project needed to confirm whether remote Supabase has the ETF tables.

Command:

```text
node --env-file=.env.local scripts/check-supabase-etf-schema.mjs
```

Result:

```text
status: ok
etf_profiles: exists, 0 rows
etf_daily_metrics: exists, 0 rows
etf_holdings: exists, 0 rows
0050: asset_type=etf, is_etf=true
006208: asset_type=etf, is_etf=true
```

## A / PM + Developer

A confirms the remote schema is ready for future ETF ingestion validation.

No ETF-specific rows exist yet, which is correct because ETF ingestion remains
blocked.

## B / Marketing

B should not describe ETF coverage as launched. The schema exists, but the data
pipeline and public product do not.

## C / Investment Advisor

C confirms schema readiness does not approve ETF scoring.

## D / Legal

D confirms schema readiness does not approve source ingestion, redistribution,
or public display.

## F / Product Design / UIUX

F may continue internal diagnostics planning, but public ETF modules remain
blocked.

## E / CEO Synthesis

CEO decision:

```text
PROCEED_INTERNAL_ONLY
```

Remote ETF schema is validated. ETF source, ingestion, scoring, and public
interpretation remain blocked.

## Not Approved

```text
ETF ingestion
ETF scoring
ETF public interpretation
Approved ETF source
```
