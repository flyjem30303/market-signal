# Data Realification Acceleration Gate

Updated: 2026-06-06

Status: `data_realification_acceleration_gate_ready_for_named_authorization`.

## Purpose

This gate compresses the data-realification governance path into the fewest necessary decisions after mock MVP readiness. The project already has one accepted bounded Supabase readonly post-run review, and that review showed aggregate row coverage is incomplete. The fastest useful path is no longer another generic readonly retry. The fastest useful path is to choose one named data-realification action and keep every other promotion blocked.

This gate does not approve SQL, Supabase writes, staging rows, production `daily_prices` mutation, market-data fetch, market-data ingestion, source-derived row storage, public source promotion, row coverage points, public Supabase data-source promotion, or real score source.

## Current Evidence

- Mock MVP baseline is accepted for review readiness.
- Bounded Supabase readonly reached the remote path and produced sanitized aggregate evidence.
- Aggregate row coverage remains incomplete.
- Data population route is already selected as `prepare_backfill_ingestion_design_gate`.
- TW equity source review is waiting for a specific human source/legal classification.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

## Governance Compression Rule

Do not create another governance-only document unless it directly enables one of these named actions:

- record a specific human source/legal classification;
- run exactly one bounded readonly diagnostic with a changed purpose;
- prepare one controlled source-specific report-only dry run;
- prepare one staging-first write authorization packet;
- update public copy to disclose mock-only and incomplete-data state.

If a proposed slice does not fit one of these actions, defer it.

## Accelerated Decision Lanes

Lane 1: Source classification.

- Required input: a human classification for one source/legal item.
- Allowed action: dry-run and apply one local classification through `docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md`.
- Still blocked after apply: source promotion, market-data retrieval, SQL, writes, public display, row coverage points, and `scoreSource=real` unless later gates explicitly pass.

Lane 2: Coverage diagnostics.

- Required input: a separately named CEO/chairman decision for one bounded readonly diagnostic with a changed purpose.
- Allowed action: exactly one readonly diagnostic, sanitized aggregate output only, immediate post-run review, no retry.
- Not recommended now unless the diagnostic question differs from the already accepted aggregate-incomplete result.

Lane 3: Backfill and ingestion route.

- Required input: source-specific execution packet that stays report-only until source rights, target table boundary, rollback, retention, and post-run review are accepted.
- Allowed action now: consolidate the first staging-first authorization packet for TW equity coverage.
- Still blocked now: market-data fetch, SQL, Supabase writes, staging rows, production `daily_prices`, public source promotion, row coverage points, and `scoreSource=real`.

Lane 4: Public runtime disclosure.

- Required input: no remote authorization needed.
- Allowed action: make the UI and copy clearer that the product is mock-only while real-data preparation is in progress.
- Still blocked: live data claims, professional signal claims, investment advice, rankings, performance claims, public source promotion, and real score claims.

## CEO Recommendation

CEO recommends PM move to Lane 3 next: prepare the first staging-first TW equity coverage authorization packet. This is the shortest path toward real data because it turns the aggregate-incomplete finding into an execution-ready route without prematurely fetching market data or writing Supabase.

PM should stop expanding source-review governance until a specific human classification exists. A1 should keep source/legal classification inputs ready. A2 should keep public copy mock-only and incomplete-data safe. Mainline should prepare the staging-first packet and the exact future authorization boundary.

## Immediate Next Slice

Create a `TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET` that answers only:

- target symbols and expected sessions;
- staging table boundary and why production `daily_prices` is still blocked;
- report-only preflight output contract;
- exact SQL/write authorization that would be required later;
- rollback and retention expectations;
- post-run review acceptance fields;
- public runtime stop lines.

Do not execute the packet in the same slice.

## Stop Lines

Stop before any action that would:

- run SQL;
- connect to Supabase for a new remote attempt;
- write Supabase;
- create staging rows;
- mutate production `daily_prices`;
- fetch market data;
- ingest market data;
- store source-derived rows;
- print secrets;
- print source payloads;
- promote public Supabase data-source mode;
- set `scoreSource=real`;
- make investment advice, recommendation, ranking, professional indicator, model-confidence, or performance claims.
