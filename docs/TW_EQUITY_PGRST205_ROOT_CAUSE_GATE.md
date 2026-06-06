# TW Equity PGRST205 Root-Cause Gate

Date: 2026-06-06

Status: `tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry`.

Decision: `CANONICAL_STAGING_OBJECTS_NOW_READABLE_RETRY_STILL_REQUIRES_SEPARATE_DECISION`

Trigger: `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md` recorded exactly one bounded staging write attempt blocked by sanitized problem code `run_insert_failed_PGRST205`.

## Scope

This gate isolates the root-cause class after the first bounded TW equity staging write attempt failed closed. It does not retry the write. It performs one bounded read-only object-reachability diagnostic, records sanitized aggregate evidence, and preserves the next decision boundary before any future write attempt.

The diagnostic did not run SQL, did not insert, update, upsert, or delete Supabase rows, did not create staging rows, did not mutate `daily_prices`, did not fetch or ingest market data, did not print row payloads, did not print raw source payloads, did not print secrets, did not promote public source, did not award row coverage points, and did not set `scoreSource=real`.

## Diagnostic Command

```powershell
$env:TW_EQUITY_PGRST205_READONLY_CONFIRMATION='CEO_APPROVED_TW_EQUITY_PGRST205_READONLY_DIAGNOSTIC_ONCE'
node scripts/report-tw-equity-pgrst205-root-cause-gate.mjs
```

Execution count: `1`

Exit code: `0`

## Sanitized Output Summary

```json
{
  "status": "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry",
  "mode": "tw_equity_pgrst205_root_cause_readonly_gate",
  "confirmation": "present",
  "credentialPresence": {
    "nextPublicSupabaseUrl": true,
    "serviceRoleKey": true
  },
  "connectionAttempted": true,
  "localStaticEvidence": {
    "canonicalMigrationPath": "supabase/migrations/0003_twse_stock_day_staging.sql",
    "localMigrationDeclaresPricesTable": true,
    "localMigrationDeclaresRunsTable": true,
    "localMigrationEnablesPricesRls": true,
    "localMigrationEnablesRunsRls": true,
    "localMigrationExists": true,
    "localMigrationIsDraftOnly": true
  },
  "objects": [
    {
      "countStatus": "ok",
      "errorCategory": "none",
      "errorCode": "none",
      "name": "staging_twse_stock_day_runs",
      "purpose": "canonical_run_metadata_table",
      "reachable": "ok"
    },
    {
      "countStatus": "ok",
      "errorCategory": "none",
      "errorCode": "none",
      "name": "staging_twse_stock_day_prices",
      "purpose": "canonical_candidate_price_table",
      "reachable": "ok"
    },
    {
      "countStatus": "ok",
      "errorCategory": "none",
      "errorCode": "none",
      "name": "twse_stock_day_staging",
      "purpose": "legacy_or_prior_remote_contract_name",
      "reachable": "ok"
    }
  ],
  "classification": {
    "nextDecision": "open_separate_ceo_retry_or_schema_cache_refresh_decision_before_any_write",
    "problems": [],
    "status": "tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry"
  },
  "safety": {
    "mutations": false,
    "publicDataSource": "mock",
    "scoreSource": "mock",
    "secretsPrinted": false,
    "sqlExecuted": false,
    "stagingRowsCreated": false,
    "supabaseWriteRetried": false
  }
}
```

Allowed output fields only: aggregate reachability status, credential-presence booleans, local static evidence booleans, sanitized error-code categories, and mock-source safety flags.

No Supabase URL, service-role key, anon key, raw row payloads, source payloads, SQL text, key prefixes, key suffixes, key lengths, or raw market data were recorded.

## Root-Cause Classification

Root-cause status: `canonical_objects_readable_after_previous_pgrst205`.

The first bounded write attempt returned `run_insert_failed_PGRST205`, which was correctly treated as `object_not_available_or_schema_cache`. This follow-up read-only diagnostic shows the canonical objects `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` are now reachable through PostgREST. That means the current blocker is no longer candidate artifact readiness or local target naming. The most likely explanations are:

- the previous attempt occurred before the remote schema cache exposed the objects;
- the remote object availability changed after the failed attempt;
- the first write path hit a transient PostgREST object-availability state;
- a future retry still requires its own explicit decision because the prior named one-attempt rule has already been consumed.

The legacy or prior contract name `twse_stock_day_staging` is also reachable. That does not replace the canonical target relation for this lane; it remains review evidence for naming-drift awareness only.

## Stop Confirmation

- STOP-001 no write retry was executed.
- STOP-002 no alternate write command was executed.
- STOP-003 no SQL or migration command was used for investigation.
- STOP-004 no market-data fetch or ingestion was executed.
- STOP-005 no `.env.local` mutation was performed.
- STOP-006 no raw payload or row payload was printed.
- STOP-007 public-facing data source remains mock.
- STOP-008 `scoreSource=real` remains blocked.
- STOP-009 row coverage points remain unawarded.
- STOP-010 runtime readiness remains unpromoted.
- STOP-011 no public real-data or staging-write success claim is approved.

## Role Review

CEO finding: The project has moved from an ambiguous `PGRST205` blocker to a clearer state: canonical staging objects are currently readable, so the next high-value decision is whether to authorize a separate one-time bounded write retry, not to rebuild candidate data or continue governance loops.

PM finding: The previous one-attempt write decision remains consumed. PM should prepare a fresh retry decision packet with the same candidate artifact, same target tables, same no-retry rule, and immediate post-run review path before executing any write.

Engineering finding: The read-only diagnostic is safe to keep as a report script because it defaults to not-run without an explicit confirmation value. Review gates must verify the recorded evidence but must not silently rerun the remote diagnostic.

Data finding: Candidate artifact readiness remains unchanged: 1 run row and 180 normalized candidate price rows are still the intended input. This gate awards no row coverage because no staging rows were created.

Security finding: Credentials were present but not printed. The service-role key was used only for a bounded head/count diagnostic and no row payloads were returned.

Investment finding: No investor-facing score, ranking, signal quality, coverage, or real-data claim may be upgraded from this diagnostic alone.

## CEO Verdict

Accepted as a completed `PGRST205` root-cause diagnostic gate. The canonical staging objects are currently readable, but no write retry is approved by this gate.

## Next Slice

NEXT-SLICE-001 create a separate bounded staging write retry decision packet if CEO chooses to proceed.

NEXT-SLICE-002 the retry packet must name the exact command, the same candidate input artifact, target relation set, maximum rows, no-retry rule, and a fresh post-run review artifact.

NEXT-SLICE-003 do not run SQL, migration, market-data fetch, public promotion, row coverage upgrade, or `scoreSource=real` in the retry decision packet.

NEXT-SLICE-004 keep `publicDataSource=mock`, `scoreSource=mock`, row coverage points unawarded, and public real-data claims blocked until a successful post-run review separately approves the next state.
