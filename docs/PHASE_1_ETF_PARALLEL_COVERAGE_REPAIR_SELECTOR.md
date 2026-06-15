# Phase 1 ETF Parallel Coverage Repair Selector

Status: `phase_1_etf_parallel_coverage_repair_selector_ready_no_fetch_no_execution`

Owner: CEO/PM

Purpose: keep Phase 1 moving while TWII waits for external operator values. ETF coverage remains the largest Level 1 gap after listed equities, but the current work must stay in mock/runtime readiness until ETF source-rights evidence is accepted.

## CEO Decision

ETF is a parallel coverage-repair lane, not an execution lane.

PM may continue ETF product/runtime preparation because the market-price scope, field contract, synthetic fixture, mock runtime handoff, coverage route, and candidate-readiness packet are already green. PM must not fetch ETF market rows, generate source-derived candidates, write Supabase, mutate `daily_prices`, award row coverage points, or promote real runtime data while the ETF source-rights outcome remains blocked.

## Current Coverage State

- target ETF symbols: `0050`, `006208`
- expected ETF rows: `120`
- observed ETF rows: `2`
- missing ETF rows: `118`
- `0050`: `1/60`, missing `59`
- `006208`: `1/60`, missing `59`
- source-rights decision: `etf_source_rights_outcome_decision_gate_blocked_external_rights_pending`
- source-rights outcome: `rejected_for_execution_pending_external_rights`
- Phase 1 data-online decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`
- public data source: `mock`
- score source: `mock`

## Proven Local Readiness

The selector depends on these green local gates:

- `check:a1-etf-market-price-source-scope-no-fetch`
- `check:a1-etf-market-price-field-contract-no-fetch`
- `check:etf-market-price-synthetic-fixture`
- `check:etf-market-price-mock-runtime-handoff`
- `check:etf-daily-prices-coverage-completion-route`
- `check:etf-source-rights-and-candidate-readiness-packet`
- `check:phase-1-etf-coverage-closure-readiness-rollup`

The source-rights outcome gate is intentionally blocked:

- `check:etf-source-rights-outcome-decision-gate`

## Workstream Split

PM mainline:

- wire or refine mock-only ETF market-price labels where they improve public comprehension;
- keep ETF coverage status visible as incomplete and source-rights-blocked;
- maintain Phase 1 go/no-go truthfulness with `publicDataSource=mock` and `scoreSource=mock`;
- prepare the future accepted-source-rights route without executing it.

A1 data support:

- continue no-fetch source-rights evidence classification;
- prepare an ETF sanitized candidate artifact schema only, without source-derived rows;
- keep coverage math for the `118` missing rows current;
- identify which external rights facts would change the blocked outcome to accepted.

A2 public copy support:

- review ETF public labels for non-advice language;
- ensure NAV, holdings, premium-discount, intraday precision, and official endorsement are not implied;
- keep delayed/missing-data wording understandable to general investors.

## Next Routes

Default PM route while rights remain blocked:

`keep_etf_parallel_coverage_repair_in_mock_runtime_readiness`

Next A1 route:

`prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`

Next A2 route:

`review_etf_mock_runtime_copy_against_non_advice_and_source_boundary`

If ETF source rights are accepted later, open a separate selector for:

`etf_sanitized_candidate_artifact_gate_for_118_missing_rows`

That later selector must still require a separate staging/write authorization gate, aggregate readback, rollback plan, post-run review, and runtime promotion gate before any public real-data claim.

## Hard Boundaries

This selector does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- ETF market-row fetch, ingestion, storage, output, or commit;
- raw payload output;
- endpoint response output;
- ETF candidate row acceptance;
- ETF row coverage points;
- NAV display;
- holdings display;
- premium-discount display;
- source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## Completion Evidence

This selector is ready when its checker proves:

1. current ETF coverage remains `2/120`, missing `118`;
2. source scope, field contract, synthetic fixture, mock runtime handoff, coverage route, candidate readiness, and rollup checks pass;
3. source-rights outcome remains blocked, not silently accepted;
4. PM/A1/A2 next routes are explicit;
5. all hard boundaries remain present;
6. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.
