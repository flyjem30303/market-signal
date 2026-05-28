# CP3 Public Claim Approval Checklist

Status: draft, not approved

Purpose:

- Define what must be true before the product can publicly claim real scores,
  validated signals, historical validation, or market coverage.
- Keep marketing, investment, legal, design, and engineering aligned before any
  public wording changes.
- Prevent internal validation artifacts from becoming public promises.

## Scope

This checklist applies to public website copy, metadata, SEO copy, product UI,
release notes, screenshots, and investor-facing materials.

Out of scope:

```text
internal review notes
mock score labels
private CP3 gate documents
unapproved remote validation output
```

## Non-Negotiable Guardrails

```text
public claim checklist draft only
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not write staging rows
do not write daily_prices
do not create seed SQL
do not store raw market rows
do not commit CSV / JSON market data files
do not set scoreSource=real
do not make public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Claim Categories

| Claim Category | Examples | Required Before Public Use |
|---|---|---|
| real score | real signal, real rating, model output | CP3 approved model, approved source depth, approved disclosure |
| validation | validated, backtested, historical evidence | approved backtest report, C / D / E approval |
| market coverage | Taiwan stocks, US stocks, global indices | approved market-specific source and model gates |
| freshness | daily updated, latest data | freshness gate, stale-data behavior, source attribution |
| investment usefulness | risk context, market condition score | non-advisory framing, legal approval, caveat placement |

## Forbidden Until Approved

```text
real score
validated signal
buy signal
sell signal
prediction
guaranteed return
outperformance
investment recommendation
global coverage
daily updated real model
AI stock advisor
```

## Required Approval Packet For Any Public Claim

```text
claim text
claim location
asset type
market
model_version
data_quality_state
source attribution
freshness state
backtest evidence reference
legal disclosure reference
owner who approved the wording
```

## Role Sign-Off Required

```text
B / Marketing approves clarity and non-hype wording
C / Investment approves model evidence and claim defensibility
D / Legal approves disclosure and non-advisory framing
E / CEO approves launch timing and trust risk
F / Design approves caveat placement and visibility
A / PM+Dev confirms runtime state matches public copy
```

## CEO Current Decision

```text
REVISE
```

This checklist is ready for role review. It is not approved for public copy
changes, runtime scoring, or production `scoreSource=real`.

## Next Implementation Slice

```text
review CP3 public claim approval checklist by role
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
