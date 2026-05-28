# CP3 Runtime State Schema Draft

Status: draft, not approved

Purpose:

- Define the future runtime state fields needed to block unsupported public
  claims and real-score display.
- Keep score readiness separate from locale, market coverage, and UI language.
- Provide a schema discussion artifact before any implementation is wired into
  the app.

## Scope

This is a local-only schema draft for CP3 review. It is not a database schema,
not a Supabase migration, and not a runtime implementation.

Out of scope:

```text
Supabase schema changes
SQL migrations
runtime UI wiring
production scoreSource=real
public real-score claims
```

## Non-Negotiable Guardrails

```text
runtime state schema draft only
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

## Candidate Type Shape

```text
scoreSource: mock | unavailable | real_candidate | real
market: tw | us | jp | global | approved extension
asset_type: stock | etf | index | fx | rate | crypto | approved extension
locale: zh-TW | en-US | approved extension
model_version: string
model_approval_state: candidate | review | approved | retired
data_quality_state: complete | partial | stale | unavailable
data_quality_score: 0..100
freshness_state: fresh | stale | unknown
source_depth_state: not_ready | review | approved | blocked
source_rights_state: not_ready | review | approved | blocked
backtest_approval_state: not_ready | review | approved | blocked
disclosure_approval_state: not_ready | review | approved | blocked
claim_approval_state: not_ready | review | approved | blocked
```

## Display Eligibility Rules

```text
public real score requires scoreSource=real
public real score requires model_approval_state=approved
public real score requires data_quality_state=complete
public real score requires source_depth_state=approved
public real score requires source_rights_state=approved
public real score requires disclosure_approval_state=approved
public real score requires claim_approval_state=approved
```

If any required field is missing or not approved:

```text
display mock, internal review, partial, stale, or unavailable
do not display real score
do not make public backtest claims
do not imply global coverage
```

## Global Isolation Rules

```text
market and asset_type must be evaluated together
locale must never upgrade market approval
locale must never upgrade model approval
model_version must match market and asset_type
ETF claims require ETF source and model gates
US stock claims require US stock source and model gates
```

## CEO Current Decision

```text
REVISE
```

This schema is ready for role review. It is not approved for runtime
implementation, Supabase migration, public copy changes, or production
`scoreSource=real`.

## Next Implementation Slice

```text
review CP3 runtime state schema draft by role
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
