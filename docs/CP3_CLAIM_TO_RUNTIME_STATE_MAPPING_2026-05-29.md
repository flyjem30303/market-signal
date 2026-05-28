# CP3 Claim-To-Runtime-State Mapping

Status: draft, not approved

Purpose:

- Map public claim categories to runtime state fields that must exist before
  claims can be shown.
- Prevent public copy from implying data, model, market, or validation readiness
  that the application cannot prove.
- Keep global expansion explicit by separating market, asset type, locale, and
  model version.

## Scope

This mapping applies to public UI, metadata, SEO copy, screenshots, release
notes, and investor-facing materials.

Out of scope:

```text
mock-only UI labels
private review documents
unapproved Supabase validation output
marketing drafts that are not shipped
```

## Non-Negotiable Guardrails

```text
runtime mapping draft only
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

## Required Runtime Fields

```text
scoreSource
model_version
model_approval_state
market
asset_type
locale
data_quality_state
data_quality_score
freshness_state
source_depth_state
source_rights_state
backtest_approval_state
disclosure_approval_state
claim_approval_state
```

## Claim Mapping

| Public Claim Category | Minimum Runtime State | Block If |
|---|---|---|
| real score | scoreSource=real, model_approval_state=approved, claim_approval_state=approved | any field missing or mock |
| validated signal | backtest_approval_state=approved, disclosure_approval_state=approved | no approved backtest |
| daily updated | freshness_state=fresh, source_depth_state=approved | stale or unknown freshness |
| Taiwan stock coverage | market=tw, asset_type=stock, model_version starts tw-stock | wrong market or asset type |
| US stock coverage | market=us, asset_type=stock, model_version starts us-stock | Taiwan-only model |
| ETF coverage | asset_type=etf, ETF source gate approved | ETF source gate blocked |
| global coverage | every claimed market has approved model and source gates | any market not approved |
| non-advisory score | disclosure_approval_state=approved and caveat visible | missing legal disclosure |

## Locale Rule

```text
locale must never upgrade model readiness
```

Examples:

```text
zh-TW locale does not approve Taiwan stock model readiness
en-US locale does not approve US stock model readiness
translated copy must still obey market and asset_type runtime states
```

## Public Display Rule

```text
If scoreSource is mock, public UI may say mock, demo, or sample only.
If claim_approval_state is not approved, public UI must not show real-score claims.
If data_quality_state is partial, stale, or unavailable, public UI must show that state.
```

## CEO Current Decision

```text
REVISE
```

This mapping is ready for role review. It is not approved for runtime
implementation, public copy changes, real scoring, or production
`scoreSource=real`.

## Next Implementation Slice

```text
review CP3 claim-to-runtime-state mapping by role
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
