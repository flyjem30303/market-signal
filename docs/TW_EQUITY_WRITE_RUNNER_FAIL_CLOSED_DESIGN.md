# TW Equity Write Runner Fail-Closed Design

Updated: 2026-06-06

Status: `tw_equity_write_runner_fail_closed_design_ready_no_runner_created`.

## Purpose

This design defines the safety contract for a future write-capable TW equity staging runner. It supports `docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md` and keeps the project ready for a later actual bounded staging write GOAL without creating or running that write.

No write runner exists in this slice. The future path `scripts/run-tw-equity-staging-write-once.mjs` remains absent.

## Fail-Closed Defaults

Any future runner must default to:

- no Supabase connection;
- no SQL;
- no file write;
- no market-data fetch;
- no market-data ingestion;
- no secret output;
- no service-role key output;
- no source payload output;
- `publicDataSource` equivalent remains `mock`;
- `scoreSource` remains `mock`;
- no staging row creation;
- no production `daily_prices` mutation;
- no row coverage points;
- no public redistribution;
- no public promotion.

## Required Runtime Guards

Before a future runner can perform any write, it must verify:

- authorization id exactly matches the approved packet;
- exact command matches the approved packet;
- lane equals `tw-equity`;
- symbols equal `2330`, `2382`, `2308`;
- sessions equals `60`;
- target relation equals `tw_equity_daily_prices_staging`;
- max rows equals `180`;
- source classification reference points to `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`;
- redistribution remains `unknown_keep_blocked` and public redistribution remains blocked;
- service-role posture is explicitly approved for this one run;
- RLS posture is explicitly acknowledged;
- rollback owner is named;
- rollback dry-run posture is defined;
- retention window is defined;
- post-run review artifact is provided;
- no retry is acknowledged;
- no public redistribution is acknowledged;
- no public promotion is acknowledged;
- no row coverage points is acknowledged;
- no score-source promotion is acknowledged.

## Execution Boundary

This design permits only future implementation planning. It does not permit SQL, Supabase writes, staging rows, `daily_prices` mutation, market-data fetch, ingestion, public source promotion, row coverage points, or real score-source promotion.

CEO decision: do not create the runnable write runner in this GOAL. Keep the actual bounded staging write as a separate next GOAL.
