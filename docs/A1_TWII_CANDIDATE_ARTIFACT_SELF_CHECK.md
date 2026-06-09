# A1 TWII Candidate Artifact Self-Check

Updated: 2026-06-09

Status: `a1_twii_candidate_artifact_self_check_ready_no_candidate_data`

## Purpose

This self-check lets A1 test a future sanitized aggregate-only TWII candidate artifact before handing it to PM.

It prints only readiness summary fields. It does not create a candidate artifact, retrieve market data, store source output, connect to Supabase, run SQL, write staging rows, mutate `daily_prices`, promote public data source, award row coverage points, or set `scoreSource=real`.

## Commands

Default path:

```text
data/candidates/twii-sanitized-candidate.json
```

Default command:

```powershell
cmd.exe /c npm run report:a1-twii-candidate-artifact-self-check
cmd.exe /c npm run check:a1-twii-candidate-artifact-self-check
```

Alternate local path:

```powershell
set A1_TWII_CANDIDATE_ARTIFACT_PATH=<local-json-path>
cmd.exe /c npm run report:a1-twii-candidate-artifact-self-check
cmd.exe /c npm run check:a1-twii-candidate-artifact-self-check
```

## Result Meaning

`a1_twii_candidate_artifact_self_check_ready_for_pm_intake_review` means A1 may hand the artifact path to PM for PM intake review.

Passing self-check does not authorize TWII source retrieval, report-only dry-run, staging write, Supabase operation, `daily_prices` mutation, row coverage scoring, or real runtime promotion. It only means `ready_for_pm_intake_review_only`.

## Stop Line

No candidate artifact is created in this slice.

No market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
