# Phase 1 Data Online Gap Closure Map

Status: `phase_1_data_online_gap_closure_map_ready`

Date: 2026-06-15

Owner: CEO / PM mainline

Support lanes: A1 Data / Source / Coverage, A2 Public Copy / Product Safety, A3 Launch / Production Engineering

## CEO Decision

CEO upgrades the active Phase 1 target from a mock-only public Beta surface to a launchable public free site that includes a real-data online path.

Phase 1 is not complete until the public product is usable and the data foundation has a controlled path to real operation.

The next highest-value path is:

1. finish Level 1 MVP row coverage from `182/360` to `360/360`;
2. close the remaining `TWII`, `0050`, and `006208` data lanes with accepted source rights, field contracts, candidate artifacts, write/readback/post-run evidence, and row coverage scoring;
3. keep runtime on `publicDataSource=mock` and `scoreSource=mock` until a separate promotion gate accepts real runtime source and real score source;
4. make public pages explain source, delay, missing data, and non-investment-advice boundaries before any real-data claim.

This map does not authorize execution. It is the PM route map for the new GOAL.

## Current Data Baseline

Authoritative current data baseline:

- Level 1 MVP universe: `TWII`, `0050`, `006208`, `2330`, `2382`, `2308`;
- expected rows: `360`;
- observed rows: `182`;
- missing rows: `178`;
- accepted TW equity sub-scope: `2330`, `2382`, `2308` at `180/180`;
- remaining index lane: `TWII` at `0/60`;
- remaining ETF lane: `0050` and `006208` at `2/120`;
- runtime source: `publicDataSource=mock`;
- score source: `scoreSource=mock`.

Evidence inputs:

- `docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md`;
- `docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md`;
- `docs/COVERAGE_UNIVERSE_ROADMAP.md`;
- `docs/DATA_POPULATION_ROUTE_DECISION_2026-06-06.md`;
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`.

## Gap Table

| Gap | Current state | Required for Phase 1 data online | Owner |
| --- | --- | --- | --- |
| MVP row coverage | `182/360` | `360/360` or explicit accepted partial-coverage Beta policy | PM + A1 |
| TWII lane | `0/60` | source rights, field contract, candidate, bounded write/readback/post-run review, scoring | A1, PM |
| ETF lane | `2/120` | `0050` and `006208` candidate artifacts, bounded write/readback/post-run review, scoring | A1, PM |
| Supabase write path | first closed loop accepted for TW equity only | repeatable write gate with rollback and post-run review for remaining lanes | PM |
| Supabase read path | readonly aggregate evidence exists | runtime-safe read contract and fail-closed behavior after data promotion | PM + A3 |
| Runtime promotion | blocked | separate approval for `publicDataSource=supabase` | PM + A2 + A3 |
| Score promotion | blocked | separate approval for `scoreSource=real` after model/data confidence gate | PM |
| Public copy | mock-safe public pages exist | source, delay, missing-data, partial-scope, and non-advice copy aligned to promoted scope | A2 |

## Execution Sequence

### Step 1 - Level 1 Coverage Closure

PM keeps the active data target at Level 1 until the MVP universe reaches `360/360`.

Do not expand to all TWSE listed stocks before Level 1 closes. Level 2 Taiwan listed-company coverage is the next major expansion, not the current success definition.

### Step 2 - Remaining Lane Candidate Acceptance

A1 prepares or verifies source-rights and field-contract evidence for:

- `TWII`;
- `0050`;
- `006208`.

Candidate artifacts must stay sanitized and must not include raw payloads, row payloads, secrets, or unreviewed market rows.

### Step 3 - Controlled Write / Readback / Post-Run Evidence

PM opens a bounded execution gate only after the lane evidence is accepted.

Each execution packet must define:

- exact symbols and sessions;
- expected row count;
- target table boundary;
- skip-existing behavior;
- rollback or cleanup path;
- sanitized output contract;
- post-run review path;
- readback and row coverage scoring gate.

### Step 4 - Runtime Promotion Gate

Runtime remains mock until a separate gate proves:

- source rights accepted for every promoted scope;
- field contract accepted for every promoted scope;
- row coverage accepted;
- read path fails closed;
- public copy explains source and delay;
- incident and rollback path exists;
- `publicDataSource=supabase` is explicitly accepted.

### Step 5 - Score Promotion Gate

Score remains mock until a separate gate proves:

- real data coverage is sufficient for the score;
- model inputs map to accepted fields;
- missing data downgrades are defined;
- public copy avoids investment advice;
- `scoreSource=real` is explicitly accepted.

## PM / A1 / A2 / A3 Assignments

PM mainline:

- own the data online route map;
- decide when a lane can move from evidence to bounded execution;
- maintain runtime promotion gate boundaries;
- integrate accepted data-line output into public route state.

A1:

- focus on `TWII`, `0050`, and `006208` Level 1 closure;
- keep artifacts source-rights-aware, field-contract-aware, and sanitized;
- do not fetch, store, print, or commit raw market data without a separately named bounded gate.

A2:

- prepare public wording for source, delay, partial coverage, missing data, non-advice, and no-official-endorsement;
- do not imply real-time data, complete coverage, or buy/sell guidance.

A3:

- keep launch, monitoring, rollback, and environment readiness aligned with the data promotion path;
- do not mutate production settings or secrets without explicit operator action.

## Hard Stops

This map does not authorize:

- SQL execution;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- investment advice;
- guaranteed return claims;
- Phase 2 membership runtime implementation.

## Acceptance Criteria

This map is accepted when:

1. it records the current Level 1 baseline as `182/360`;
2. it records TW equity sub-scope as `180/180`;
3. it records remaining `TWII` as `0/60`;
4. it records remaining ETF lane as `2/120`;
5. it separates Level 1 MVP closure from Level 2 all-listed expansion;
6. it keeps `publicDataSource=mock` and `scoreSource=mock`;
7. it defines the required runtime promotion and score promotion gates;
8. it assigns PM, A1, A2, and A3;
9. it does not authorize remote writes, raw data handling, or real promotion.

## Next PM Route

Next route: `phase_1_data_online_level_1_closure_then_runtime_promotion_gate`.

PM should next choose one of two execution-oriented slices:

1. `prepare_twii_etf_level_1_closure_execution_packet_without_raw_payloads`;
2. `implement_public_runtime_data_online_readiness_summary_fail_closed`.

CEO recommendation: choose option 1 first because `360/360` coverage is the main blocker before runtime promotion can become meaningful.
