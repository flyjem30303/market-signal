# CP3 Source-Depth Evidence Gate Draft

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 runtime state sample packet validation gate role review selected source-depth evidence as the next blocker

Status: CP3 source-depth evidence gate draft recorded

## CEO Decision

```text
REVISE
```

This source-depth evidence gate is a local-only planning artifact. It does not
approve historical ingestion, remote validation, Supabase reads, SQL execution,
runtime repository work, public UI wiring, production `scoreSource=real`, or
public claims.

```text
does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production `scoreSource=real`, or public claims
```

## Evidence Objective

```text
define what evidence is required before source_depth_state can move beyond not_ready
keep latest-row dry-run separate from historical evidence
keep source-depth evidence separate from source-rights evidence
keep source-depth evidence separate from backtest approval
keep source-depth evidence separate from public claim approval
prevent scoreSource=real from bypassing source-depth evidence
```

## Required Evidence Categories

```text
price history depth evidence
fundamental history depth evidence
preferred start date evidence
continuous symbol coverage evidence
missing-date handling evidence
corporate-action handling evidence
inactive and delisted symbol handling evidence
endpoint stability evidence
field semantics evidence
market-calendar alignment evidence
sample-size threshold evidence
reproducibility evidence
```

## Minimum Evidence Thresholds

```text
price history must cover at least 756 trading dates
fundamental history must cover at least 252 trading dates
preferred start date must be 2020-01-01 or earlier
continuous symbol coverage must be documented
corporate-action handling must be documented
inactive and delisted symbol handling must be documented
missing-date behavior must be documented
endpoint stability must be documented
field semantics must be documented
market-calendar alignment must be documented
```

## Current Evidence Status

```text
source_depth_state remains not_ready
price-history-depth-not-ready remains expected
fundamental-history-depth-not-ready remains expected
price-history-starts-after-2020-01-01 remains expected
fundamental-history-starts-after-2020-01-01 remains expected
latest-row seed is not historical evidence
controlled dry-run report is not backtest evidence
sample packet validation is not source-depth evidence
```

## Required Source References

```text
docs/CP3_TW_STOCK_SOURCE_DEPTH_VALIDATION.md
docs/CP3_TW_STOCK_HISTORICAL_DATA_PLAN.md
docs/CP3_TW_STOCK_HISTORICAL_SOURCE_RESEARCH_2026-05-29.md
docs/CP3_TWSE_STOCK_DAY_HISTORICAL_ENDPOINT_RESEARCH_2026-05-29.md
docs/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_DESIGN_2026-05-29.md
docs/reviews/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_2026-05-29.md
scripts/check-cp3-tw-stock-source-depth.mjs
```

## Non-Negotiable Guardrails

```text
source-depth evidence gate draft only
do not create JSON sample artifacts
do not create JSON market data
do not create CSV market data
do not fetch market data
do not run source-depth validator against Supabase
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not wire policy into data fetching
do not implement runtime repository
do not read remote data
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
do not clear source-depth not_ready
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## CEO Synthesis

```text
The evidence bar is now explicit. The project should keep source_depth_state
not_ready until the minimum historical depth, coverage, missing-date,
corporate-action, inactive-symbol, endpoint, field, calendar, sample-size, and
reproducibility evidence is reviewed. The next safe slice is a role review for
this evidence gate.
```

## Next Implementation Slice

```text
record CP3 source-depth evidence gate role review
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
