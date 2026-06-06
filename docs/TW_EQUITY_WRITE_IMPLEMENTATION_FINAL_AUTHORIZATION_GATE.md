# TW Equity Write Implementation Final Authorization Gate

Updated: 2026-06-06

Status: `tw_equity_write_implementation_final_authorization_gate_ready_not_approved`.

## Purpose

This gate defines the last local authorization boundary before the project may create a real Supabase staging write implementation for the TW equity lane.

It does not create the write implementation, connect to Supabase, run SQL, write staging rows, fetch market data, store raw data, or execute a bounded staging write attempt.

## CEO Decision

CEO decision: the project may prepare this final authorization gate now. The next stage may implement real write capability only after a separately named CEO approval accepts this gate and explicitly authorizes implementation work.

This gate is intentionally narrower than a broad production-data launch:

- it may authorize only one internal staging write implementation path;
- it may not authorize public source promotion;
- it may not authorize row coverage points;
- it may not authorize `scoreSource=real`;
- it may not authorize production `daily_prices` mutation;
- it may not authorize raw market-data storage.

## Required Completed Inputs

The following local gates must exist and pass before implementation approval can be considered:

- `docs/TW_EQUITY_WRITE_PRE_EXECUTION_SUMMARY.md`;
- `docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md`;
- `docs/TW_EQUITY_WRITE_IMPLEMENTATION_DESIGN_TO_CODE_BOUNDARY.md`;
- `docs/TW_EQUITY_WRITE_CAPABLE_RUNNER_IMPLEMENTATION_READINESS_GATE.md`;
- `docs/TW_EQUITY_ONE_ATTEMPT_STAGING_WRITE_PREFLIGHT_GATE.md`;
- `docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md`;
- `scripts/run-tw-equity-staging-write-once.mjs`.

## What A Future Approval May Permit

If this gate is later accepted by a separately named CEO implementation approval, PM may implement only:

- service-role Supabase client creation inside the server-side runner;
- insert into `staging_twse_stock_day_runs`;
- insert into `staging_twse_stock_day_prices`;
- exactly one bounded staging write attempt;
- candidate input consumption from an already-sanitized artifact;
- rollback dry-run count before mutation;
- sanitized aggregate stdout output;
- immediate post-run review recording.

## What Remains Forbidden

Even after this gate is accepted, the following remain forbidden unless a later separate gate authorizes them:

- production `daily_prices` mutation;
- public source promotion;
- row coverage point award;
- `scoreSource=real`;
- raw source payload output;
- row payload output;
- secret output;
- retry after failure;
- broad ingestion job;
- destructive rollback execution;
- public API exposure of staging rows;
- client-side Supabase service-role access.

## First Write Attempt Conditions

The first bounded write attempt must be exactly one attempt and must satisfy:

- exact authorization id: `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`;
- exact target relation: `staging_twse_stock_day_runs,staging_twse_stock_day_prices`;
- exact lane: `tw-equity`;
- exact symbols: `2330`, `2382`, `2308`;
- max rows: `180`;
- accepted sanitized candidate input artifact;
- `writePreExecutionSummaryReady=true`;
- `rollbackDryRunCountReady=true`;
- service-role key presence checked without printing the key;
- sanitized aggregate stdout only;
- immediate post-run review at `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md`;
- no retry.

## Post-Run Review Acceptance

The post-run review must record:

- whether the write implementation attempted connection;
- whether SQL mutation occurred;
- inserted run-row count;
- inserted price-row count;
- affected `run_id`;
- rollback dry-run count before mutation;
- whether any row payload, source payload, or secret was printed;
- whether the attempt used exactly one try;
- whether public promotion, row coverage points, and score-source promotion remained blocked;
- final decision: `accepted`, `rejected`, or `needs_cleanup_review`.

The post-run review alone must not promote public data source, award row coverage points, or set `scoreSource=real`.

## Current Stop Line

Current decision: final authorization gate is ready for review but not accepted. Real write implementation remains blocked.

No SQL, Supabase connection, Supabase write, staging row creation, production `daily_prices` mutation, market-data fetch, market-data ingestion, candidate artifact creation, source payload output, row payload output, secret output, public promotion, row coverage points, or `scoreSource=real` occurred.
