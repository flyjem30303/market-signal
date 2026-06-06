# TW Equity Schema Exposure Repair Decision Packet

Date: 2026-06-06

Status: `tw_equity_schema_exposure_repair_decision_packet_ready_no_repair_executed`.

## Purpose

This packet converts the latest `PGRST205` evidence into a bounded repair decision before any third TW equity staging write attempt.

## Accepted Evidence

- Two bounded staging write attempts failed closed with sanitized `run_insert_failed_PGRST205` and no mutation.
- Canonical staging objects were reachable through bounded read-only metadata probes.
- Local insert contract is clean: candidate insert columns match the local migration contract and the write runner targets `staging_twse_stock_day_runs` plus `staging_twse_stock_day_prices`.
- The bounded PostgREST OpenAPI schema exposure probe reached and parsed OpenAPI, but both canonical staging tables were not exposed in the OpenAPI schema.

## CEO Decision

The current root-cause candidate is PostgREST schema exposure or schema cache mismatch, not candidate generation, runner target naming, or local insert column shape.

The next repair route is:

1. inspect Supabase Dashboard API schema exposure for the `public` schema;
2. confirm whether `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` are included in the exposed REST/OpenAPI schema;
3. perform a dashboard/manual schema cache reload or equivalent non-data-changing metadata refresh if available;
4. rerun exactly one bounded PostgREST schema exposure probe;
5. only if OpenAPI exposure becomes complete, prepare a separate third bounded staging write decision.

## Allowed By This Packet

- Local documentation and checkers.
- Manual dashboard inspection instructions.
- A future non-data-changing dashboard/manual schema exposure or schema cache refresh decision.
- A future bounded readonly PostgREST schema exposure probe after repair.

## Not Allowed By This Packet

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

Create a schema exposure repair runbook that the operator can follow in Supabase Dashboard without data mutation. The runbook must have an accepted/rejected outcome record before any new remote write decision.

## Safety Confirmation

- No Supabase connection;
- no SQL execution;
- no migration execution;
- no write attempt;
- no staging rows created;
- no `daily_prices` mutation;
- no market-data fetch or ingestion;
- no raw payloads printed;
- no row payloads printed;
- no secrets printed;
- `publicDataSource=mock`;
- `scoreSource=mock`.
