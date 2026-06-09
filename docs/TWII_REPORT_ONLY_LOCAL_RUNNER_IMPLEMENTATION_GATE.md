# TWII Report-Only Local Runner Implementation Gate

Updated: 2026-06-09

Status: `twii_report_only_local_runner_implementation_gate_ready`

## Purpose

This gate introduces a local-only TWII report-only runner skeleton.

The runner skeleton only validates a local sanitized aggregate-only TWII candidate artifact and emits aggregate-only review output. It does not retrieve market data, parse remote source output, connect to Supabase, run SQL, write staging rows, mutate `daily_prices`, create source-derived candidate data, promote public data source, award row coverage points, or set `scoreSource=real`.

## Runner Command

Default path:

```powershell
cmd.exe /c npm run report:twii-report-only-local-runner
```

Alternate local artifact path:

```powershell
set A1_TWII_CANDIDATE_ARTIFACT_PATH=<local-json-path>
cmd.exe /c npm run report:twii-report-only-local-runner
```

## Expected Behavior

If the artifact is missing or invalid, the runner returns:

```text
twii_report_only_local_runner_blocked_candidate_artifact_not_ready
```

If the artifact is valid, the runner returns:

```text
twii_report_only_local_runner_completed_aggregate_only
```

Completed means only local artifact shape validation completed. It does not mean real market data was fetched or inserted.

## Stop Line

No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
