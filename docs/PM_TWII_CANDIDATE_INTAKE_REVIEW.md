# PM TWII Candidate Intake Review

Updated: 2026-06-09

Status: `pm_twii_candidate_intake_review_ready_no_candidate_data`

## Purpose

This review is the PM handoff point after A1 prepares a sanitized aggregate-only TWII candidate artifact.

It collapses A1 self-check and PM intake into one CEO decision-ready summary so the next step is clear without another governance loop.

## Commands

Default path:

```powershell
cmd.exe /c npm run report:pm-twii-candidate-intake-review
cmd.exe /c npm run check:pm-twii-candidate-intake-review
```

Alternate local path:

```powershell
set A1_TWII_CANDIDATE_ARTIFACT_PATH=<local-json-path>
cmd.exe /c npm run report:pm-twii-candidate-intake-review
cmd.exe /c npm run check:pm-twii-candidate-intake-review
```

## Decision Meaning

The report requires A1 self-check to be ready for PM intake review.

If it passes, PM status becomes `pm_twii_candidate_intake_review_ready_for_report_only_dry_run_decision`.

This review does not authorize report-only execution, staging write execution, SQL, Supabase operation, `daily_prices` mutation, row coverage scoring, or real runtime promotion. Passing review only means `ready_for_next_report_only_dry_run_decision_only`.

The remaining required steps are CEO naming exactly one bounded report-only attempt, exact command confirmation, credential posture check, same-slice post-run review, bounded aggregate readback, and no retry without a separate new decision.

## Stop Line

No candidate artifact is created in this slice.

No market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
