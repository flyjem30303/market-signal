# Phase 1 Data Online Parallel Unblock Selector

Status: `phase_1_data_online_parallel_unblock_selector_ready_no_execution`

Owner: CEO/PM

Purpose: move Phase 1 data-online work forward without pretending the data line is ready. The public runtime is readable and mock-safe, but data-online remains `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`. The next progress path must therefore split TWII, ETF, and public-copy guard work in parallel.

## CEO Decision

Do not wait on a single lane.

TWII remains the smallest first closure candidate because it can close `60` missing Level 1 rows, but it is blocked by external operator values and final authorization. ETF remains the largest remaining Level 1 gap with `118` missing rows, but it is blocked by source-rights acceptance evidence. PM should keep both lanes active while preserving mock runtime truthfulness.

## Current Data-Online State

- Phase 1 data-online decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`
- Level 1 expected rows: `360`
- Level 1 observed rows: `182`
- Level 1 missing rows: `178`
- TW equity rows: `180/180`
- TWII missing rows: `60`
- ETF missing rows: `118`
- public data source: `mock`
- score source: `mock`
- TWII execution allowed now: `false`

## Parallel Workstream Split

PM mainline:

- keep `check:phase-1-public-beta-final-readiness-rollup` green;
- keep `check:phase-1-data-online-go-no-go-status` green and honestly `NO_GO`;
- maintain the execution selector so future authorized data work starts from current evidence;
- do not open SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch, or real runtime promotion from this state.

A1 data support:

- TWII lane: prepare operator-value intake review without storing values, printing values, or executing a write;
- ETF lane: prepare `prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`;
- keep ETF candidate rows schema-only until source-rights evidence is accepted;
- update coverage math only from accepted aggregate evidence, not raw rows.

A2 trust/public-copy support:

- review public ETF/TWII labels against non-advice language;
- keep official-source, live-data, complete-coverage, NAV, holdings, premium-discount, and endorsement implications out of Phase 1 copy;
- keep delayed/missing-data wording readable to general investors.

## Required Green Inputs

This selector depends on these current gates:

- `check:phase-1-data-online-go-no-go-status`
- `check:phase-1-data-online-execution-selector`
- `check:phase-1-twii-operator-decision-intake-readiness`
- `check:phase-1-twii-operator-decision-packet-request`
- `check:phase-1-etf-parallel-coverage-repair-selector`
- `check:a2-twii-operator-decision-public-copy-guard`
- `check:public-beta-production-brief-alignment`
- `check:phase-1-public-beta-final-readiness-rollup`

## Next Routes

Default PM route:

`keep_parallel_unblock_selector_current_until_one_lane_becomes_executable`

Next A1 TWII route:

`prepare_twii_operator_values_shape_review_without_value_storage_or_execution`

Next A1 ETF route:

`prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`

Next A2 route:

`review_twii_etf_public_copy_against_non_advice_and_source_boundary`

If TWII operator values are accepted later, open:

`twii_final_authorization_stopline_and_server_only_pre_execution_review`

If ETF source rights are accepted later, open:

`etf_sanitized_candidate_artifact_gate_for_118_missing_rows`

## Hard Boundaries

This selector does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- TWII or ETF market-row fetch, ingestion, storage, output, or commit;
- raw payload output;
- endpoint response output;
- operator value storage;
- candidate row acceptance;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## Completion Evidence

This selector is ready when its checker proves:

1. data-online remains `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`;
2. coverage remains `182/360`, missing `178`;
3. TWII remains blocked with `60` missing rows and no execution allowed;
4. ETF remains blocked with `118` missing rows and source-rights pending;
5. PM/A1/A2 next routes are explicit;
6. final public route readiness remains green;
7. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.
