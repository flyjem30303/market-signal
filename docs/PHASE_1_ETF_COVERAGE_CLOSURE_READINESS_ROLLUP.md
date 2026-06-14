# Phase 1 ETF Coverage Closure Readiness Rollup

Status: `phase_1_etf_coverage_closure_readiness_rollup_ready_rights_blocked`

Owner: CEO/PM

Purpose: consolidate the Phase 1 ETF lane after TWII has reached the operator-packet waiting point. ETF coverage can reduce the current Level 1 data gap by `118` rows, but it remains blocked for real execution until source-rights evidence is accepted.

## CEO Decision

ETF is the next parallel data-coverage lane, but only as a readiness and mock-runtime lane for now. The project must not create ETF source-derived candidates, fetch ETF market data, write Supabase, mutate `daily_prices`, award ETF row coverage points, or promote real source/score state until the ETF source-rights outcome gate changes from blocked to accepted in a separate decision.

## Current ETF Coverage State

- target symbols: `0050`, `006208`
- expected ETF rows: `120`
- observed ETF rows: `2`
- missing ETF rows: `118`
- `0050`: `1/60`, missing `59`
- `006208`: `1/60`, missing `59`
- current blocker: `legal_and_redistribution_terms_unapproved`
- source-rights outcome: `rejected_for_execution_pending_external_rights`
- public data source: `mock`
- score source: `mock`

## Current Proven Readiness

The following local-only checks are green:

- `check:a1-etf-market-price-source-scope-no-fetch`
- `check:a1-etf-market-price-field-contract-no-fetch`
- `check:etf-market-price-synthetic-fixture`
- `check:etf-market-price-mock-runtime-handoff`
- `check:etf-daily-prices-coverage-completion-route`
- `check:etf-source-rights-and-candidate-readiness-packet`

The following execution gate is intentionally blocked:

- `check:etf-source-rights-outcome-decision-gate`

Blocked status is correct while the ETF lane lacks accepted storage, retention, redistribution, attribution, derived-analysis, rate-limit, delay/missing wording, and aggregate-only review evidence.

## Allowed Work Now

PM may continue:

- public runtime copy that explains ETF coverage is not real-data complete;
- mock-only ETF market-price cards or labels using synthetic fixture output;
- field-contract refinement for daily market price only;
- source-rights decision packet preparation;
- ETF candidate artifact schema design without source-derived rows;
- launch-readiness documentation that keeps ETF real execution blocked.

## Not Allowed Now

This readiness rollup must not:

- fetch ETF market data;
- read or store raw source payloads;
- generate ETF candidate rows from remote/source data;
- write staging rows;
- mutate `daily_prices`;
- connect to Supabase for ETF execution;
- award ETF row coverage points;
- claim ETF real data is live;
- promote public runtime data source;
- promote score source;
- include NAV, holdings, premium-discount, intraday iNAV, or factsheet text in Phase 1 ETF market-price closure.

## Stop Lines

Stop immediately if any of these are not false:

- `rawMarketDataFetched`
- `rawMarketDataStored`
- `rawPayloadOutput`
- `rowPayloadOutput`
- `stockIdPayloadOutput`
- `supabaseConnected`
- `supabaseWriteAttempted`
- `stagingRowsCreated`
- `dailyPricesMutated`
- `publicDataSourceSupabasePromoted`
- `scoreSourceRealPromoted`

## Next Route

If ETF source rights remain blocked, PM should keep ETF in mock/runtime readiness and continue one of:

1. TWII operator packet intake review.
2. Public runtime comprehension cleanup.
3. ETF source-rights accepted outcome packet preparation.

If ETF source rights are accepted later, open a separate ETF sanitized candidate artifact gate for exactly `118` missing rows, then a separate staging/write authorization gate, aggregate readback, rollback, post-run review, and runtime promotion gate.
