# TW Equity Source Classification Minimal Execution Route

Updated: 2026-06-06

Status: `tw_equity_source_classification_minimal_execution_route_applied_still_blocked`.

## Purpose

This route compresses the current TW equity source/legal blocker into the smallest executable path. It does not classify anything by itself and does not record any outcome by itself.

Classification is not a UI category chip. It is not the home-page filter labels such as index, ETF, semiconductor, IC design, electronics, power, or AI server. Classification here means one source/legal outcome for one ledger item.

## Current Blocker

The lane received human classifications on 2026-06-06. The current outcome is `6` planning classifications and `1` `unknown_keep_blocked` classification. Until the remaining blocker and the separate write authorization are resolved, the TW equity lane remains blocked for source approval, write authorization, staging execution, row coverage points, public source promotion, and real score source.

## Allowed Input Shape

The minimum human input for one classification is:

- `id`: one of `permitted-use`, `attribution`, `redistribution`, `retention`, `rate-limit-and-outage`, `delay-incompleteness-public-display`, or `derived-score-use`.
- `classification`: one of `accepted_for_local_planning_only`, `accepted_for_internal_only`, `accepted_for_delayed_public_display`, `accepted_for_derived_metrics_only`, `rejected`, or `unknown_keep_blocked`.
- `recordedBy`: one of `CEO`, `Chairman`, `Legal`, or `PM`.
- `recordedAt`: ISO timestamp.
- `note`: a short human basis. Do not copy provider terms, source text, source payload, secrets, or market values into the repo.

If the human input is missing, vague, or favorable by inference only, stop and keep the lane blocked.

## Minimal Route

1. Inspect the current ledger:

```powershell
node scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs
```

2. Dry-run one classification only:

```powershell
node scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs --dry-run --id "<id>" --classification "<classification>" --recordedBy "<recordedBy>" --recordedAt "<recordedAt>" --note "<note>"
```

3. Apply only if the dry-run passes and the same concrete human classification still stands:

```powershell
node scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs --apply --id "<id>" --classification "<classification>" --recordedBy "<recordedBy>" --recordedAt "<recordedAt>" --note "<note>"
```

4. Run immediate post-apply checks:

```powershell
node scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs
node scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs
node scripts/check-tw-equity-source-review-readiness-summary.mjs
node scripts/check-tw-equity-staging-first-preflight-runner.mjs
node scripts/check-review-gates.mjs
```

## Minimum First Classification

CEO recommends starting with `permitted-use` because it decides whether the lane can even keep moving beyond local planning. If `permitted-use` is rejected or unknown, do not create the future write runner until a concrete classification exists and the blocker is explicitly resolved.

One classification is not enough to promote the lane unless the remaining rights needed for the intended action are also classified. A narrow acceptance may support local planning only and still block staging writes, public display, redistribution, or derived metric use.

## Existing Artifacts This Route Depends On

- `docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md`
- `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`
- `scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs`
- `scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs`
- `docs/TW_EQUITY_SOURCE_REVIEW_READINESS_SUMMARY.md`
- `docs/TW_EQUITY_STAGING_FIRST_WRITE_AUTHORIZATION_PACKET_V1.md`
- `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_TEMPLATE_V1.md`

## Still Blocked After This Route Exists

- SQL.
- Supabase connection, reads, or writes.
- Staging rows.
- Production `daily_prices` mutation.
- Market-data fetch or ingestion.
- Source-derived row storage.
- Public source promotion.
- Row coverage points.
- `scoreSource=real`.
- Future write-runner creation or execution.

## CEO Decision

This route has been applied for the chairman's 2026-06-06 classification set. PM should not create the future write runner until `redistribution` is resolved and a separate write authorization exists. Keep runtime/mock MVP hardening and local staging-readiness design moving while the source lane remains blocked for promotion.
