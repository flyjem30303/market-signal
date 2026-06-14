# Phase 1 Data Online Execution Selector

Status: `phase_1_data_online_execution_selector_ready_no_execution`

Date: 2026-06-15

Owner: CEO / PM mainline

Support lanes: A1 Data / Source / Coverage, A2 Public Copy / Product Safety, A3 Launch / Production Engineering

## Purpose

This selector converts the current Phase 1 data-online documents into one PM decision surface.

It answers one question:

What is the next highest-value safe action toward data online, without accidentally running SQL, writing Supabase, mutating `daily_prices`, fetching raw market data, or promoting runtime source?

This selector does not authorize execution. It is a no-execution routing gate.

## Current Baseline

Authoritative baseline:

- Level 1 expected rows: `360`;
- Level 1 observed rows: `182`;
- Level 1 missing rows: `178`;
- accepted TW equity rows: `180/180`;
- remaining TWII rows: `0/60`;
- remaining ETF rows: `2/120`;
- public runtime source: `publicDataSource=mock`;
- score source: `scoreSource=mock`;
- data-online decision: `NO_GO_FOR_DATA_ONLINE`.

Authoritative source documents:

- `docs/PHASE_1_DATA_ONLINE_GAP_CLOSURE_MAP.md`;
- `docs/PHASE_1_LEVEL_1_CLOSURE_EXECUTION_PACKET.md`;
- `docs/PHASE_1_DATA_ONLINE_GO_NO_GO_STATUS.md`;
- `docs/OPEN_FREE_AUTO_DATA_SOURCE_GATE.md`;
- `docs/PHASE_1_TWII_OPERATOR_DECISION_PACKET_REQUEST.md`;
- `docs/PHASE_1_ETF_COVERAGE_CLOSURE_READINESS_ROLLUP.md`.

## Selector Decision

Selected next route: `twii_first_level_1_closure_exact_execution_gate_or_repair`.

Reason:

- TWII closes `60` missing rows with one symbol and one index lane.
- TWII has a sanitized aggregate candidate artifact path already referenced.
- TWII has the smallest remaining Level 1 blast radius compared with ETF `118` missing rows.
- Real execution is still blocked, so the safe PM action is to prepare or repair the exact execution gate and operator intake, not to run the writer.

## Ordered Route Queue

### Route 1 - TWII Exact Execution Gate Or Repair

Route id: `twii_first_level_1_closure_exact_execution_gate_or_repair`

Current posture: `selected_but_execution_blocked`

PM action:

1. verify TWII source-rights and field-contract acceptance;
2. verify the sanitized aggregate candidate artifact remains aggregate-only;
3. verify the final operator packet contains only accepted no-secret fields;
4. prepare the exact execution command packet as a separate future decision;
5. stop if authorization values, execute-switch confirmation, credential checks, rollback readiness, or post-run review are incomplete.

Still not allowed:

- SQL;
- Supabase connection/write;
- staging rows;
- `daily_prices` mutation;
- market endpoint fetch;
- raw payload or row payload output;
- row coverage point award;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`.

### Route 2 - ETF Source-Rights And Field-Contract Parallel Repair

Route id: `etf_source_rights_field_contract_parallel_repair`

Current posture: `parallel_pre_execution_only`

PM/A1 action:

1. keep ETF source-rights outcome separate from TWII;
2. accept or repair ETF daily price field contract;
3. prepare candidate shape criteria for `0050` and `006208`;
4. do not generate source-derived ETF candidates until rights and field contracts are accepted.

Reason:

- ETF can close `118` missing rows later.
- ETF should not block TWII first closure, but it should advance in parallel while TWII waits for operator packet acceptance.

### Route 3 - TWSE OpenAPI Metadata / Terms / Backfill Readiness

Route id: `twse_openapi_metadata_terms_backfill_readiness_refresh`

Current posture: `safe_no_fetch_parallel_support`

PM/A1 action:

1. keep TWSE OpenAPI as the accepted legal/free/automatable source candidate for bounded validation;
2. refresh field-contract and parser/backfill readiness only with synthetic or metadata-level evidence;
3. do not fetch, store, or commit raw market rows;
4. keep public attribution wording honest and non-endorsing.

Reason:

- This supports both TWII and future Taiwan listed-company expansion.
- It does not require manual daily operation or paid vendor contract.

### Route 4 - Runtime Promotion Gate Preparation

Route id: `runtime_promotion_gate_prepare_but_keep_mock`

Current posture: `blocked_until_write_readback_quality_rollback_pass`

PM/A2/A3 action:

1. keep public pages honest about source, delay, missing data, and non-investment advice;
2. keep runtime read path fail-closed;
3. prepare promotion checklist only after row coverage write/readback/post-run review passes;
4. do not set `publicDataSource=supabase`;
5. do not set `scoreSource=real`.

Reason:

- Runtime promotion is meaningless until Level 1 data closure has accepted evidence.
- Users must never see a real-data claim before source, coverage, quality, timestamp, and fallback gates pass.

## PM Routing Rule

PM should apply this selector at the start of every data-online slice:

1. If TWII operator packet and source/field/candidate evidence are accepted, continue Route 1 and prepare the exact bounded execution gate.
2. If TWII remains blocked, continue Route 2 and Route 3 in parallel without raw data fetch or database writes.
3. If a write/readback/post-run review is later accepted, open Route 4 as a separate promotion preparation gate.
4. If any route would require secrets, raw rows, SQL, Supabase write, or irreversible mutation, stop and create a separate operator decision packet.

## Acceptance Criteria

This selector is accepted when:

1. it records Level 1 as `182/360` with `178` missing rows;
2. it selects TWII first while stating execution is blocked;
3. it keeps ETF as parallel pre-execution repair;
4. it keeps TWSE OpenAPI metadata/terms/backfill readiness as safe no-fetch support;
5. it keeps runtime promotion blocked until write/readback/quality/rollback pass;
6. it keeps `publicDataSource=mock`;
7. it keeps `scoreSource=mock`;
8. it references the authoritative gap, closure, go/no-go, open-source, TWII, and ETF documents;
9. it does not authorize SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, real-data promotion, real-score promotion, or investment advice.

## Next PM Route

Next route: `twii_first_level_1_closure_exact_execution_gate_or_repair`.

If TWII remains blocked by missing operator acceptance, PM should immediately move to `etf_source_rights_field_contract_parallel_repair` and `twse_openapi_metadata_terms_backfill_readiness_refresh` rather than waiting.
