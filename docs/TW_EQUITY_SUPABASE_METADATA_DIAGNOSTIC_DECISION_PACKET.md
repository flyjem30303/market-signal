# TW Equity Supabase Metadata Diagnostic Decision Packet

Date: 2026-06-06

Status: `tw_equity_supabase_metadata_diagnostic_decision_packet_ready_not_executed`.

Decision: `READY_FOR_SEPARATE_BOUNDED_METADATA_DIAGNOSTIC_AUTHORIZATION`

Runner status: bounded metadata diagnostic runner prepared at `scripts/report-tw-equity-supabase-metadata-diagnostic-once.mjs`; execution still requires `TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_CONFIRMATION=CEO_APPROVED_TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_ONCE`.

## Purpose

This packet prepares the next bounded Supabase metadata diagnostic after the local UUID contract repair. The goal is to classify whether the remaining `PGRST205` write blocker is caused by REST insert schema exposure, PostgREST schema cache, exposed object metadata, RLS/policy posture, or read-only versus write-path schema parity.

This packet does not execute the diagnostic. It does not connect to Supabase, run SQL, execute a migration, write staging rows, fetch market data, print secrets, print row payloads, promote public data, award row coverage points, or set `scoreSource=real`.

## Accepted Preconditions

- PRE-001 two bounded staging write attempts failed closed with `run_insert_failed_PGRST205` and no mutation.
- PRE-002 canonical staging objects were previously readable through bounded read-only diagnostics.
- PRE-003 local target relation naming matches `staging_twse_stock_day_runs,staging_twse_stock_day_prices`.
- PRE-004 local run-id UUID contract is repaired by `TW_EQUITY_RUN_ID_UUID_CONTRACT_REPAIR_GATE`.
- PRE-005 candidate artifact remains sanitized with 1 candidate run row and 180 candidate price rows.

## Diagnostic Scope

Allowed if separately authorized:

- DIAG-001 exactly one bounded remote diagnostic run.
- DIAG-002 target only `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`.
- DIAG-003 use read-only metadata-safe operations such as HEAD/count or zero-row select probes.
- DIAG-004 record only sanitized aggregate evidence: reachable/blocked, count status, sanitized error code, sanitized error category, and local static evidence booleans.
- DIAG-005 write a post-run review artifact immediately after execution.

Blocked even if the diagnostic is authorized:

- BLOCK-001 no third write attempt.
- BLOCK-002 no SQL execution.
- BLOCK-003 no migration execution.
- BLOCK-004 no insert/update/upsert/delete operation.
- BLOCK-005 no staging row creation.
- BLOCK-006 no production `daily_prices` mutation.
- BLOCK-007 no market-data fetch or ingestion.
- BLOCK-008 no raw row payload, raw market-data payload, SQL text, Supabase URL, key prefix, key suffix, key length, or secret output.
- BLOCK-009 no public data source promotion.
- BLOCK-010 no row coverage points.
- BLOCK-011 no `scoreSource=real`.

## Proposed Future Command

The future command now uses the bounded metadata diagnostic runner. It should follow this shape:

```powershell
$env:TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_CONFIRMATION='CEO_APPROVED_TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_ONCE'
node scripts/report-tw-equity-supabase-metadata-diagnostic-once.mjs --target "staging_twse_stock_day_runs,staging_twse_stock_day_prices" --post-run-review "docs/reviews/TW_EQUITY_SUPABASE_METADATA_DIAGNOSTIC_POST_RUN_REVIEW_2026-06-06.md"
```

This packet does not run that remote diagnostic runner. The runner itself must fail closed without confirmation and may perform only one bounded read-only metadata diagnostic.

## Expected Classifications

- `metadata_reachable_insert_blocker_unresolved`: objects are readable and metadata appears reachable, so write-path insert exposure still needs a separate one-attempt write decision or dashboard/API metadata comparison.
- `metadata_schema_cache_or_object_not_available`: one or both canonical objects return sanitized `PGRST205` or equivalent object/schema-cache blocker.
- `metadata_access_or_policy_blocked`: one or both objects return a sanitized access/policy/scope category.
- `metadata_column_contract_or_cache_blocked`: relation exists but requested metadata/columns return a sanitized column-contract or schema-cache category.
- `metadata_project_or_network_blocked`: project URL or network reachability prevents classification.

## CEO Verdict

Accepted as the next decision packet after UUID contract repair. CEO should choose this route if dashboard metadata evidence is not immediately available. Do not run a third write attempt until this diagnostic or equivalent dashboard evidence confirms the metadata/cache posture.

## PM Next Action

Create the metadata diagnostic runner and post-run template only if CEO decides to proceed with a separate execution slice. Until then, keep work local-only.

## Safety Confirmation

- no remote Supabase connection;
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
