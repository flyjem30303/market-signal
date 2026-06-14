# Phase 1 Level 1 Closure Execution Packet

Status: `phase_1_level_1_closure_execution_packet_ready_no_raw_payloads`

Date: 2026-06-15

Owner: CEO / PM mainline

Support lanes: A1 Data / Source / Coverage, A2 Public Copy / Product Safety, A3 Launch / Production Engineering

## Purpose

This packet prepares the next bounded data action for the active GOAL:

`prepare_twii_etf_level_1_closure_execution_packet_without_raw_payloads`

The purpose is to move Level 1 MVP row coverage toward `360/360` by preparing the remaining `TWII`, `0050`, and `006208` lanes for later separately authorized execution.

This packet is not an execution approval. It does not fetch market data, does not connect to Supabase, does not run SQL, does not write staging rows, does not mutate `daily_prices`, and does not promote runtime or score source.

## Current Coverage Baseline

Level 1 MVP universe:

- `TWII`;
- `0050`;
- `006208`;
- `2330`;
- `2382`;
- `2308`.

Current accepted baseline:

- expected rows: `360`;
- observed rows: `182`;
- missing rows: `178`;
- TW equity sub-scope: `2330`, `2382`, `2308` at `180/180`;
- remaining TWII lane: `TWII` at `0/60`;
- remaining ETF lane: `0050` and `006208` at `2/120`;
- runtime source: `publicDataSource=mock`;
- score source: `scoreSource=mock`.

## Lane Execution Readiness Matrix

| Lane | Current | Target | Missing | Source-rights state | Field-contract state | Candidate state | Execution posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `TWII` | `0/60` | `60/60` | `60` | pending PM/CEO acceptance | pending PM acceptance | sanitized aggregate candidate path exists for PM review | no-write chain only until final gate |
| `0050` | `1/60` | `60/60` | `59` | blocked pending ETF source-rights outcome | pending ETF field contract | no source-derived candidate artifact | planning only |
| `006208` | `1/60` | `60/60` | `59` | blocked pending ETF source-rights outcome | pending ETF field contract | no source-derived candidate artifact | planning only |

CEO decision:

- TWII should remain the first execution candidate because it can move Level 1 from `182/360` to `242/360` with a smaller blast radius.
- ETF lanes may proceed in parallel only through source-rights, field-contract, candidate-shape, and execution-readiness preparation.
- ETF lanes must not generate source-derived candidates until source rights and field contracts are accepted.

## Packet A - TWII

Packet id: `phase1-level1-twii-closure-prep`

Scope:

- symbol: `TWII`;
- asset type: `index`;
- target table: `daily_prices`;
- coverage window: `60` sessions;
- current rows: `0`;
- expected rows: `60`;
- missing rows: `60`;
- source lane: `official-exchange-index` or later accepted fallback;
- candidate artifact path: `data/candidates/twii-sanitized-candidate.json`;
- output policy: `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`.

Required before execution:

1. accepted TWII source-rights outcome;
2. accepted TWII index field contract;
3. accepted sanitized candidate artifact self-check;
4. exact bounded command packet with authorization id and confirmation token;
5. runner boundary check proving no broader symbols, no broader fields, and no promotion;
6. post-run review template;
7. aggregate readback contract;
8. rollback/stop condition;
9. row coverage scoring gate update after post-run review.

Allowed now:

- local packet review;
- no-write preview chain;
- aggregate-only candidate shape validation;
- PM acceptance or repair decision.

Not allowed now:

- SQL;
- Supabase read/write;
- staging rows;
- `daily_prices` mutation;
- raw market-data fetch;
- row payload output;
- row coverage point award;
- `publicDataSource=supabase`;
- `scoreSource=real`.

## Packet B - ETF 0050

Packet id: `phase1-level1-0050-closure-prep`

Scope:

- symbol: `0050`;
- asset type: `etf`;
- target table: `daily_prices`;
- coverage window: `60` sessions;
- current rows: `1`;
- expected rows: `60`;
- missing rows: `59`;
- candidate artifact path: not created;
- output policy: `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`.

Required before execution:

1. accepted ETF source-rights outcome for `0050`;
2. accepted ETF field contract for daily price coverage;
3. sanitized ETF candidate artifact shape with exactly `59` missing rows or an accepted reason for a different count;
4. staging/write authorization packet;
5. post-run review template;
6. aggregate readback contract;
7. rollback/cleanup rule;
8. row coverage scoring gate update after post-run review.

Allowed now:

- source-rights outcome intake;
- field-contract preparation;
- candidate artifact shape planning;
- execution-readiness criteria.

Not allowed now:

- source-derived candidate generation;
- market endpoint fetch;
- SQL;
- Supabase write;
- staging rows;
- `daily_prices` mutation;
- row payload output;
- public promotion.

## Packet C - ETF 006208

Packet id: `phase1-level1-006208-closure-prep`

Scope:

- symbol: `006208`;
- asset type: `etf`;
- target table: `daily_prices`;
- coverage window: `60` sessions;
- current rows: `1`;
- expected rows: `60`;
- missing rows: `59`;
- candidate artifact path: not created;
- output policy: `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`.

Required before execution:

1. accepted ETF source-rights outcome for `006208`;
2. accepted ETF field contract for daily price coverage;
3. sanitized ETF candidate artifact shape with exactly `59` missing rows or an accepted reason for a different count;
4. staging/write authorization packet;
5. post-run review template;
6. aggregate readback contract;
7. rollback/cleanup rule;
8. row coverage scoring gate update after post-run review.

Allowed now:

- source-rights outcome intake;
- field-contract preparation;
- candidate artifact shape planning;
- execution-readiness criteria.

Not allowed now:

- source-derived candidate generation;
- market endpoint fetch;
- SQL;
- Supabase write;
- staging rows;
- `daily_prices` mutation;
- row payload output;
- public promotion.

## Shared Execution Contract For A Later Gate

A future execution packet must include:

- one exact command string;
- one PM/CEO accepted authorization id;
- one confirmation token;
- one lane or a clearly partitioned lane list;
- explicit max rows;
- missing-only behavior;
- skip-existing behavior;
- duplicate rejection;
- aggregate-only sanitized output;
- rollback/cleanup condition;
- immediate post-run review;
- aggregate readback;
- row coverage scoring update;
- runtime source preserved as `publicDataSource=mock` until promotion gate;
- score source preserved as `scoreSource=mock` until score gate.

Any command drift, row payload output, raw payload output, source-rights mismatch, field-contract mismatch, unexpected symbol, unexpected row count, or missing rollback rule must stop execution.

## Public Runtime Boundary

The public runtime remains:

- `publicDataSource=mock`;
- `scoreSource=mock`.

Public pages may say data-realification work is in progress. Public pages must not say:

- real-time data is live;
- all Level 1 coverage is complete;
- public source has been promoted;
- scoring is real;
- the site gives investment advice;
- any buy/sell action is recommended.

## PM / A1 / A2 / A3 Assignments

PM:

- accept or repair this packet;
- choose TWII first unless a source-rights blocker makes ETF safer;
- open a separate exact execution gate only after evidence and contracts are accepted.

A1:

- prepare TWII and ETF source-rights/field-contract evidence;
- keep candidate artifacts sanitized and aggregate-only;
- do not fetch, store, print, or commit market rows.

A2:

- prepare public copy for partial coverage, missing data, delayed source, non-advice, and no-official-endorsement;
- keep copy aligned with mock runtime until promotion gate passes.

A3:

- ensure later write/readback/rollback evidence can fit launch and monitoring operations;
- do not mutate production settings or secrets.

## Hard Stops

This packet does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- market endpoint fetch;
- raw market-data ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- source-derived ETF candidate generation;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- investment advice;
- guaranteed return claims;
- Phase 2 membership runtime implementation.

## Acceptance Criteria

This packet is accepted when:

1. it records Level 1 current coverage as `182/360`;
2. it records TW equity sub-scope as `180/180`;
3. it records TWII as `0/60`;
4. it records ETF lane as `2/120`;
5. it defines TWII, `0050`, and `006208` lane packets;
6. it makes TWII the first execution candidate;
7. it keeps ETF lanes blocked before source-rights and field-contract acceptance;
8. it requires readback, rollback, post-run review, and row coverage scoring;
9. it keeps `publicDataSource=mock` and `scoreSource=mock`;
10. it does not authorize raw data handling, Supabase mutation, or promotion.

## Next PM Route

Next route: `twii_first_level_1_closure_exact_execution_gate_or_repair`.

If TWII source-rights and field-contract evidence remain insufficient, PM should route to:

`twii_source_rights_field_contract_repair_before_execution`.

If TWII becomes accepted but ETF remains blocked, PM may advance TWII first and keep ETF as:

`etf_source_rights_field_contract_parallel_repair`.
