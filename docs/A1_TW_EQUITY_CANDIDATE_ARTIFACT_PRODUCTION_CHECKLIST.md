# A1 TW Equity Candidate Artifact Production Checklist

Updated: 2026-06-06

Status: `a1_tw_equity_candidate_artifact_production_checklist_ready_no_candidate_data`.

## Purpose

This checklist tells A1 exactly what must be completed before PM can review a TW equity sanitized candidate artifact.

It is intentionally a production checklist, not another governance loop. It exists so A1 can move from source work to a handoff artifact without guessing the sequence.

## Commands

```powershell
node scripts/report-a1-tw-equity-candidate-artifact-production-checklist.mjs
node scripts/check-a1-tw-equity-candidate-artifact-production-checklist.mjs
```

If A1 uses a local candidate artifact path:

```powershell
$env:A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH="<local-json-path>"
node scripts/report-a1-tw-equity-candidate-artifact-production-checklist.mjs
node scripts/check-a1-tw-equity-candidate-artifact-production-checklist.mjs
```

## Required Sequence

1. `source_and_rights_evidence_attached`: A1 records source, attribution, retention, redistribution posture, and delay/incompleteness notes for `2330`, `2382`, and `2308`.
2. `sanitized_artifact_created_outside_this_slice`: A1 creates one sanitized JSON artifact matching `docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md`.
3. `a1_self_check_passed`: A1 runs `node scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs`.
4. `pm_intake_review_passed`: PM runs `node scripts/check-pm-tw-equity-candidate-intake-review.mjs`.

## Artifact Boundaries

The artifact must use:

- `authorizationId=TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`;
- `targetRelation=staging_twse_stock_day_runs,staging_twse_stock_day_prices`;
- `sourceId=twse-stock-day`;
- symbols `2330`, `2382`, and `2308`;
- `maxRows` no greater than `180`;
- `sourcePayloadIncluded=false`;
- `sourceUrlPayloadIncluded=false`;
- `secretsIncluded=false`.

It must not contain source payloads, source URL payloads, row-level source output, service-role key material, secrets, source HTML, source CSV, or public redistribution claims.

## PM Handoff Meaning

Passing this checklist and the later PM review only means `ready_for_ceo_bounded_staging_write_decision_only`.

It does not authorize SQL, Supabase write, staging row creation, public source promotion, row coverage point award, or `scoreSource=real`.

## Stop Line

No candidate artifact is created in this slice.

No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
