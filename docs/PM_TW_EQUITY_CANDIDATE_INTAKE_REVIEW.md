# PM TW Equity Candidate Intake Review

Updated: 2026-06-06

Status: `pm_tw_equity_candidate_intake_review_ready_no_candidate_data`.

## Purpose

This review is the PM handoff point after A1 prepares a sanitized TW equity candidate artifact.

It collapses A1 self-check and PM intake into one CEO decision-ready summary so the next step is clear without another governance loop.

## Commands

Default path:

```powershell
node scripts/report-pm-tw-equity-candidate-intake-review.mjs
node scripts/check-pm-tw-equity-candidate-intake-review.mjs
```

Alternate local path:

```powershell
$env:A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH="<local-json-path>"
node scripts/report-pm-tw-equity-candidate-intake-review.mjs
node scripts/check-pm-tw-equity-candidate-intake-review.mjs
```

## Decision Meaning

The report requires both:

- A1 self-check ready for PM intake review;
- PM intake accepted for execution review.

If both pass, PM status becomes `pm_tw_equity_candidate_intake_review_ready_for_ceo_bounded_staging_write_decision`.

This review does not authorize staging write execution. Passing review only means `ready_for_ceo_bounded_staging_write_decision_only`.

The remaining required steps are CEO naming exactly one bounded staging write attempt, exact command confirmation, credentials posture check, same-slice post-run review, and no retry without a separate new decision.

## Stop Line

No candidate artifact is created in this slice.

No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
