# A1 TW Equity Candidate Artifact Self-Check

Updated: 2026-06-06

Status: `a1_tw_equity_candidate_artifact_self_check_ready_no_candidate_data`.

## Purpose

This self-check lets A1 test a sanitized TW equity candidate artifact before handing it to PM.

It reuses the PM intake contract and prints only readiness summary fields. It does not create a candidate artifact, fetch market data, store source outputs, connect to Supabase, run SQL, write staging rows, mutate `daily_prices`, promote public data source, award row coverage points, or set `scoreSource=real`.

## Commands

Default path:

```powershell
node scripts/report-a1-tw-equity-candidate-artifact-self-check.mjs
node scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs
```

Alternate local path:

```powershell
$env:A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH="<local-json-path>"
node scripts/report-a1-tw-equity-candidate-artifact-self-check.mjs
node scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs
```

## Result Meaning

`a1_tw_equity_candidate_artifact_self_check_ready_for_pm_intake_review` means A1 may hand the artifact path to PM for PM intake review.

Passing self-check does not authorize staging write execution. It only means `ready_for_pm_intake_review_only`.

Staging write execution still requires PM intake review, a CEO-named bounded staging write attempt, exact command confirmation, credentials posture check, and same-slice post-run review.

## Stop Line

No candidate artifact is created in this slice.

No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
