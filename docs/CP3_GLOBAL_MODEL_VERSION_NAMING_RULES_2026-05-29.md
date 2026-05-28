# CP3 Global Model Version Naming Rules

Status: draft, not approved

Purpose:

- Define a model-version naming convention that supports Taiwan-first
  development and later global expansion.
- Prevent Taiwan-specific assumptions from becoming hidden global defaults.
- Make asset type, market, model family, and approval state visible in every
  future real-score artifact.

```text
supports Taiwan-first development and later global expansion
```

## Scope

This document covers model-version names for future scoring models across:

```text
Taiwan stocks
Taiwan ETFs
US stocks
global indices
future market-specific assets
```

It does not approve any real score, model implementation, backtest claim, or
production `scoreSource=real`.

## Non-Negotiable Guardrails

```text
naming rules draft only
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

## Required Name Shape

```text
{market}-{asset_type}-{model_family}-{major}.{minor}-{approval_state}
```

Required parts:

```text
market: tw, us, jp, global, or approved ISO-like market code
asset_type: stock, etf, index, fx, rate, crypto, or approved extension
model_family: signal, risk, quality, macro, or approved extension
major.minor: numeric model design version
approval_state: candidate, review, approved, retired
```

## Examples

```text
tw-stock-signal-0.1-candidate
tw-etf-signal-0.1-candidate
us-stock-signal-0.1-candidate
global-index-risk-0.1-candidate
```

The current Taiwan stock draft identifier `tw-stock-signal-v0.1-candidate`
should be normalized before any future runtime use.

## Approval State Rules

| State | Meaning | Public Real Score Allowed |
|---|---|---|
| candidate | draft, not approved | no |
| review | under CP3 review | no |
| approved | CP3, legal, source, and disclosure gates approved | only if all gates approve |
| retired | no longer valid for new scoring | no |

## Market-Specific Isolation Rules

```text
Taiwan stock approval does not approve Taiwan ETF scoring
Taiwan stock approval does not approve US stock scoring
Taiwan ETF source approval does not approve index scoring
US stock model approval does not approve non-US markets
global-index model approval does not approve individual securities
```

## User Locale Separation

```text
model_version is not a locale
locale controls language and formatting
market controls exchange and source rules
asset_type controls model inputs and disclosure
```

Examples:

```text
zh-TW users can view us-stock-signal-0.1-candidate only as mock/internal until approved
en-US users can view tw-stock-signal-0.1-candidate only as mock/internal until approved
```

## CEO Current Decision

```text
REVISE
```

These naming rules are ready for role review. They are not approved for runtime
scoring, public claims, or production `scoreSource=real`.

## Next Implementation Slice

```text
review global model-version naming rules by role
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
