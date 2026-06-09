# TWII Report-Only Dry-Run Decision Gate

Updated: 2026-06-09

Status: `twii_report_only_dry_run_decision_gate_ready_no_execution`

## Purpose

This gate is the CEO/PM decision point after A1 TWII candidate artifact self-check and PM candidate intake review.

It does not execute a report-only runner. It does not retrieve market data, store source output, connect to Supabase, run SQL, write staging rows, mutate `daily_prices`, promote public data source, award row coverage points, or set `scoreSource=real`.

## Inputs

The gate reads the PM intake review:

```powershell
cmd.exe /c npm run report:pm-twii-candidate-intake-review
```

Optional local artifact path:

```powershell
set A1_TWII_CANDIDATE_ARTIFACT_PATH=<local-json-path>
```

## Decision Output

If PM intake is not ready, the gate returns:

```text
twii_report_only_dry_run_decision_gate_blocked_candidate_artifact_not_ready
```

If PM intake is ready, the gate returns:

```text
twii_report_only_dry_run_decision_gate_ready_for_named_attempt_decision
```

Ready means CEO may name exactly one future bounded report-only dry-run attempt. It does not run that attempt.

## Named Attempt Requirements

A future named attempt must specify:

- `attemptId`;
- artifact path;
- runner command;
- maximum one report-only execution;
- aggregate-only output policy;
- no raw payload output;
- no row payload output;
- no stock id payload output;
- same-slice post-run review;
- bounded aggregate readback plan;
- no retry without a new decision.

## Commands

```powershell
cmd.exe /c npm run report:twii-report-only-dry-run-decision-gate
cmd.exe /c npm run check:twii-report-only-dry-run-decision-gate
```

## Stop Line

This gate stops before report-only execution.

No market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
