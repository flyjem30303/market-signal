# Backfill / Ingestion Design Gate Execution Packet

Updated: 2026-06-06

Status: `backfill_ingestion_packet_ready_design_only_not_executable`.

Trigger: `docs/DATA_POPULATION_ROUTE_DECISION_2026-06-06.md`.

## Purpose

This packet converts the selected data population route into a reviewable backfill / ingestion design gate packet. It is a preparation artifact only.

It does not approve execution. It does not run SQL, connect to Supabase, write Supabase, create staging rows, modify `daily_prices`, fetch market data, ingest market data, store raw market data, print secrets, print raw payloads, promote the public source, award row coverage points, or set `scoreSource=real`.

## Execution Status

- Current status: `design_only_not_authorized_for_execution`.
- Future execution requires a separately named CEO/chairman approval.
- Future execution must name exact command, exact source lane, exact target table posture, exact rollback posture, and exact post-run review artifact.
- Any command drift, source drift, target-table drift, or missing rollback statement stops execution.

## Source-Specific Lanes

| Lane | Symbols | Owner | Required Before Execution |
| --- | --- | --- | --- |
| TW index | `TWII` | A1 Data | Source rights, attribution, field contract, retention, and historical coverage evidence. |
| TW ETF | `0050`, `006208` | A1 Data + Legal | ETF source rights, redistribution limits, NAV-vs-market-price scope, field coverage, and attribution copy. |
| TW equity | `2330`, `2382`, `2308` | PM / Engineering | Report-only dry-run packet based on existing TWSE STOCK_DAY designs, field validation, and source-rights linkage. |

## Target-Table Boundary

Default future posture: staging first.

Direct `daily_prices` mutation is blocked until a later packet explicitly proves:

- staging is unnecessary or already validated;
- RLS and service-role posture are reviewed;
- duplicate handling is defined;
- upsert key is reviewed;
- rollback is non-destructive by default;
- post-run review acceptance criteria are present.

## Report-Only Dry-Run Contract

Before any write-capable runner exists, prepare a report-only dry-run contract that emits only:

- lane id;
- symbols count and symbol list;
- expected trading sessions;
- expected row count;
- missing-row estimate;
- field coverage summary;
- validation status;
- source-rights status;
- target-table posture;
- rollback posture;
- no secrets printed;
- no raw payloads printed;
- no files written;
- no mutations.

The report-only dry-run must not fetch market data unless a later source-specific packet explicitly authorizes that action.

## Rollback And Retention Contract

- Rollback owner must be named.
- Rollback must be scoped by run id or staging batch id.
- Rollback must dry-run affected row counts before destructive cleanup exists.
- Rollback must not touch production `daily_prices` unless a later mutation packet explicitly authorizes it.
- Retention window must be named before storing any source-derived rows.
- Failure classifications must include source unavailable, rights blocked, schema mismatch, duplicate rows, partial coverage, and validation failed.

## Required Post-Run Review Template

Any future authorized execution must immediately record:

- authorization id;
- exact command;
- execution count;
- source lane;
- target table posture;
- rows proposed;
- rows written;
- rows rejected;
- validation status;
- rollback status;
- retention status;
- files written;
- mutations;
- SQL execution status;
- Supabase write status;
- secrets printed;
- raw payloads printed;
- public data source remains mock until promotion gate;
- score source remains mock until score-source gate;
- no promotion by itself.

## Required Pre-Execution Gates

- `scripts/check-data-population-route-decision.mjs`.
- `scripts/check-backfill-ingestion-design-gate.mjs`.
- Source-rights packet accepted for the selected lane.
- Report-only dry-run packet accepted for the selected lane.
- Target-table boundary packet accepted.
- Rollback and retention packet accepted.
- Post-run review template accepted.
- Full review gate returns `ok`.

## Non-Goals

- Do not run SQL.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch, ingest, store, or commit raw market data.
- Do not print secrets or raw payloads.
- Do not promote `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not award row coverage points.

## CEO Next Step

Next slice: create the first lane-specific report-only dry-run packet for TW equity (`2330`, `2382`, `2308`) because existing TWSE STOCK_DAY design references are already available.
