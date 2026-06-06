# TW Equity Schema Exposure Repair Runbook

Date: 2026-06-06

Status: `tw_equity_schema_exposure_repair_runbook_ready_awaiting_manual_outcome`.

## Purpose

This runbook gives the operator a non-data-changing path to resolve the current TW equity staging blocker before any third bounded staging write decision.

The current root-cause candidate is PostgREST schema exposure or schema cache mismatch. The bounded OpenAPI probe was reachable and parseable, but `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` were not exposed in the OpenAPI schema.

## Preconditions

- Use Supabase Dashboard or an equivalent non-data-changing admin surface.
- Do not run SQL from this runbook.
- Do not create, insert, update, upsert, delete, truncate, or backfill rows.
- Do not fetch, ingest, store, or commit market data.
- Do not print or paste secrets into project files, logs, screenshots, or chat.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.

## Manual Repair Steps

1. Open the Supabase project Dashboard.
2. Inspect API or REST schema exposure settings for the `public` schema.
3. Confirm whether both canonical staging tables are expected to appear in the REST/OpenAPI schema:
   - `staging_twse_stock_day_runs`
   - `staging_twse_stock_day_prices`
4. If the Dashboard provides a schema cache reload, REST schema refresh, API schema refresh, or equivalent non-data-changing metadata refresh, run only that metadata refresh.
5. Do not perform any table mutation, SQL migration, policy change, data load, write attempt, row coverage promotion, or public data promotion during this runbook.
6. Record the outcome in `data/source-gates/tw-equity-schema-exposure-repair-outcomes.json`.

Use a dry-run first:

```bash
npm run record:tw-equity-schema-exposure-repair-outcome -- --dry-run --id tw-equity-postgrest-schema-exposure-cache-repair --outcome accepted --recordedBy CEO --note "Manual non-data-changing schema exposure/cache repair was completed; no SQL, write, market-data action, raw payload output, or secret output occurred."
```

Apply only after the dry-run output is clean:

```bash
npm run record:tw-equity-schema-exposure-repair-outcome -- --apply --id tw-equity-postgrest-schema-exposure-cache-repair --outcome accepted --recordedBy CEO --note "Manual non-data-changing schema exposure/cache repair was completed; no SQL, write, market-data action, raw payload output, or secret output occurred."
```

## Accepted Outcome Means

The outcome can be recorded as `accepted` only when all of these are true:

- the operator inspected the project API/REST schema exposure;
- the operator confirmed the `public` schema is the intended REST schema;
- the operator confirmed both canonical staging tables should be exposed to the REST/OpenAPI schema;
- a non-data-changing metadata refresh or dashboard/schema exposure adjustment was completed, or the Dashboard clearly showed no adjustment was required;
- no SQL, migration, table mutation, staging write, market-data fetch, raw payload output, or secret output occurred.

Accepted outcome only allows the next bounded OpenAPI schema exposure probe. It does not authorize a third staging write attempt.

## Rejected Outcome Means

Record `rejected` if any of these are true:

- the Dashboard cannot confirm API/REST schema exposure;
- the staging tables are intentionally not exposed;
- the project requires SQL or migration work before exposure can be repaired;
- the operator cannot perform a non-data-changing refresh;
- any safety boundary is uncertain.

Rejected outcome blocks the next bounded OpenAPI probe until a new repair packet is created.

## Still Not Authorized

- no SQL execution;
- no migration execution;
- no insert/update/upsert/delete operation;
- no third staging write attempt;
- no staging rows created;
- no `daily_prices` mutation;
- no market-data fetch or ingestion;
- no raw OpenAPI payload output;
- no row payload output;
- no secret output;
- no public data promotion;
- no row coverage points;
- no `scoreSource=real`.

## Next PM Action

Wait for an accepted or rejected outcome record. If and only if the outcome is accepted, prepare one bounded PostgREST OpenAPI schema exposure probe rerun as a separate slice. Do not proceed directly to staging write.
