# CP3 Source-Depth Evidence Matrix

Date: 2026-05-29
Owner: E / CEO
Checkpoint: CP3 Model Credibility

Status: CP3 source-depth evidence matrix recorded

## CEO Decision

```text
REVISE
```

This matrix is a local-only planning artifact. It does not approve historical
ingestion, remote validation, Supabase reads, SQL execution, runtime repository
work, public UI wiring, production `scoreSource=real`, source-depth approval,
or public claims.

```text
does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production
source-depth approval, or public claims
```

## Matrix

| Evidence category | Owner | Required artifact | Checker | Current status | Blocked runtime action | Future display implication |
| --- | --- | --- | --- | --- | --- | --- |
| Price history depth | A / PM+Dev | Documented trading-date count by market, symbol set, and date range | `scripts/check-cp3-tw-stock-source-depth.mjs` plus future evidence checker | not_ready | production score calculation and public approved display | unavailable |
| Fundamental history depth | C / Investment | Documented valuation / fundamental date count and field availability | `scripts/check-cp3-tw-stock-source-depth.mjs` plus future evidence checker | not_ready | valuation-based score components and public approved display | unavailable |
| Preferred start date | A / PM+Dev | Evidence that usable history starts 2020-01-01 or earlier | future evidence checker | not_ready | backtest window claims and public approved display | internal_review |
| Continuous symbol coverage | C / Investment | Coverage table for selected symbols, listing gaps and exclusions | future evidence checker | not_ready | universe-level scoring and market-wide claims | partial |
| Missing-date handling | A / PM+Dev | Documented policy for holidays, suspended trading, no-trade days, and missing rows | future evidence checker | not_ready | freshness-sensitive scoring and public approved display | stale |
| Corporate-action handling | C / Investment | Documented adjustment policy for splits, dividends, capital reductions, and comparable price history | future evidence checker | not_ready | backtest claims and price-derived score components | internal_review |
| Inactive and delisted symbol handling | C / Investment | Documented policy for inactive, suspended, merged, and delisted symbols | future evidence checker | not_ready | survivorship-sensitive backtest claims | partial |
| Endpoint stability | A / PM+Dev | Documented endpoint behavior, rate behavior, schema stability, and failure modes | future evidence checker | not_ready | automated ingestion and runtime repository work | unavailable |
| Field semantics | C / Investment plus D / Legal | Documented meaning, unit, adjustment status, and permitted use for every score field | future evidence checker | not_ready | score calculation and public explanation claims | internal_review |
| Market-calendar alignment | A / PM+Dev | Documented Taiwan trading calendar alignment and timezone behavior | future evidence checker | not_ready | freshness state and stale-data claims | stale |
| Sample-size thresholds | C / Investment | Documented minimum symbol count, trading-day count, sector spread, and exclusion criteria | future evidence checker | not_ready | model confidence claims and public approved display | internal_review |
| Reproducibility | A / PM+Dev | Documented rerun steps, deterministic inputs, versioned assumptions, and review owner | future evidence checker | not_ready | production score publication and audit claims | unavailable |

## Current Status Summary

```text
source_depth_state remains not_ready
price history depth remains not_ready
fundamental history depth remains not_ready
preferred start date remains not_ready
continuous symbol coverage remains not_ready
missing-date handling remains not_ready
corporate-action handling remains not_ready
inactive and delisted symbol handling remains not_ready
endpoint stability remains not_ready
field semantics remains not_ready
market-calendar alignment remains not_ready
sample-size thresholds remains not_ready
reproducibility remains not_ready
```

## Source Boundaries

```text
latest-row seed is not historical evidence
controlled dry-run report is not backtest evidence
sample packet validation is not source-depth evidence
source-depth evidence is not source-rights evidence
source-depth evidence is not backtest approval
source-depth evidence is not public claim approval
```

## Future Checker Requirements

```text
future evidence checker must keep all evidence categories separate
future evidence checker must reject source_depth_state approved when any category is not_ready
future evidence checker must reject public approved display when price history depth is not_ready
future evidence checker must reject public approved display when fundamental history depth is not_ready
future evidence checker must reject public approved display when reproducibility is not_ready
future evidence checker must remain local-only until CEO approves remote validation
```

## Non-Negotiable Guardrails

```text
source-depth evidence matrix only
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
The matrix makes source-depth ownership and blocked runtime actions explicit.
The next safe slice is a role review, then a local-only evidence checker plan
that decides how to validate matrix completeness without parsing market data.
```

## Next Implementation Slice

```text
record CP3 source-depth evidence matrix role review
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
