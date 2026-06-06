# TW Equity Supabase Staging Write Repair Evidence Checklist

Date: 2026-06-06

Status: `tw_equity_supabase_staging_write_repair_evidence_checklist_ready_no_remote_action`.

Decision: `REPAIR_EVIDENCE_CHECKLIST_READY_BEFORE_ANY_REPAIR_OR_THIRD_ATTEMPT`

## Purpose

This checklist converts the accepted repair decision packet into the minimum evidence PM must collect before CEO chooses a repair route. It is intentionally narrower than another full governance cycle: gather the evidence, classify the blocker, then choose one repair route.

This slice does not connect to Supabase, run SQL, execute a migration, write staging rows, fetch market data, print secrets, promote public data, award row coverage points, or set `scoreSource=real`.

## Input Evidence Already Accepted

- ACCEPTED-001 first bounded write attempt failed closed with `run_insert_failed_PGRST205` and no mutation.
- ACCEPTED-002 canonical staging objects were readable through bounded read-only diagnostics.
- ACCEPTED-003 second bounded write retry reached the guarded write path and again failed closed with `run_insert_failed_PGRST205` and no mutation.
- ACCEPTED-004 candidate artifact remains accepted at 1 run row and 180 price rows.
- ACCEPTED-005 runtime remains mock-only and row coverage remains unchanged.

## Evidence Checklist

### C1 REST Insert Schema Exposure

Evidence needed:

- C1-E001 identify the Supabase API exposed schema that the server-side insert client uses.
- C1-E002 confirm whether `staging_twse_stock_day_runs` is available to that API schema for insert metadata.
- C1-E003 confirm whether `staging_twse_stock_day_prices` is available to that API schema for insert metadata.

Classification:

- If both target relations are missing from API metadata, route to dashboard exposed-schema or schema-cache repair.
- If both are present, move to C2 and C4 before any write retry.

### C2 PostgREST Schema Cache

Evidence needed:

- C2-E001 identify whether staging objects were created or changed after the last API schema cache refresh.
- C2-E002 identify whether a dashboard schema cache reload or equivalent non-data-changing refresh is available to the operator.
- C2-E003 record whether cache refresh is a configuration action or requires a migration/SQL path.

Classification:

- If metadata is stale, route to dashboard/manual schema cache refresh instructions.
- If metadata is current, move to C3, C4, and C6.

### C3 Object And Schema Name Match

Evidence needed:

- C3-E001 confirm the actual schema and relation names of the run and price staging objects.
- C3-E002 compare actual names against runner target `staging_twse_stock_day_runs,staging_twse_stock_day_prices`.
- C3-E003 confirm the read-only diagnostic and write runner use the same target names and schema posture.

Classification:

- If target names diverge, route to runner target contract repair.
- If names match, keep the runner target unchanged and move to C4 and C6.

### C4 RLS And Policy Posture

Evidence needed:

- C4-E001 identify whether RLS is enabled on each staging relation.
- C4-E002 identify whether service-role writes should bypass or satisfy policies for both staging relations.
- C4-E003 classify whether the observed `PGRST205` likely occurs before policy evaluation.

Classification:

- If policy posture blocks service-role insert after metadata is confirmed, route to RLS/policy repair packet.
- If `PGRST205` happens before policy evaluation, prioritize C1/C2/C3/C6 first.

### C5 Read-Only Versus Insert Path Match

Evidence needed:

- C5-E001 compare client configuration used by bounded read-only diagnostics and write runner.
- C5-E002 confirm the same Supabase project URL is used without printing it.
- C5-E003 confirm the write path is not using a hidden schema, alternate table name, or stale target list.

Classification:

- If read and insert paths differ, route to runner/client configuration repair.
- If paths match, proceed to C6.

### C6 Insert Payload And Column Contract

Evidence needed:

- C6-E001 list the sanitized column keys the runner sends for the run record.
- C6-E002 list the sanitized column keys the runner sends for price records.
- C6-E003 compare those keys with the expected staging relation column contract without printing row values.
- C6-E004 identify required non-null fields that the candidate artifact or runner does not provide.

Classification:

- If column contract diverges, route to runner payload contract repair.
- If column contract matches and C1-C5 are satisfied, CEO may prepare a third-attempt readiness packet.

## Route Decision Matrix

- ROUTE-A dashboard/manual schema cache repair: allowed only when C1/C2 show metadata exposure or cache mismatch; no data mutation by this packet.
- ROUTE-B SQL/migration repair packet: allowed only as a draft/review packet until separately accepted; execution is not allowed here.
- ROUTE-C runner target or payload repair: allowed as local code work if C3/C5/C6 show local mismatch; must pass mock-only checks before any remote attempt.
- ROUTE-D bounded read-only diagnostic: allowed only after a separate decision packet names the exact non-mutating diagnostic.
- ROUTE-E third bounded write attempt: blocked until checklist evidence is recorded and CEO accepts a separate one-attempt packet.

## Forbidden Until Checklist Evidence Is Accepted

- no third write retry
- no SQL execution
- no migration execution
- no insert, update, upsert, or delete operation
- no Supabase staging row creation
- no production `daily_prices` mutation
- no market-data fetch or ingestion
- no raw row payload, raw market payload, or secret output
- no public data source promotion
- no row coverage points
- no `scoreSource=real`

## CEO Verdict

Accepted as the minimum repair evidence checklist. CEO should use it to choose the next high-value route:

1. If the team can inspect dashboard/API metadata manually, do ROUTE-A checklist fill.
2. If local code mismatch is visible from repository files, do ROUTE-C local repair first.
3. If neither is conclusive, draft ROUTE-D bounded read-only diagnostic decision.

## PM Next Action

Create or fill a repair evidence collection record using this checklist. Do not perform the repair or third attempt in the same slice.
