# TW Equity Provider-Specific Terms Apply Runbook

Updated: 2026-06-06

Status: `tw_equity_provider_specific_terms_apply_runbook_ready_no_outcome_recorded`.

Trigger: `docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md`.

Related artifacts:

- `docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_PACKET.md`.
- `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`.
- `scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs`.
- `scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs`.
- `scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs`.
- `scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs`.
- `docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md`.

## Purpose

This runbook defines how PM may safely record one TW equity provider terms outcome after a human reviewer supplies a classification. This runbook does not record any outcome by itself.

The runbook remains local-only. It does not approve source use, provider terms, source license, redistribution, retention, public display, derived-score use, SQL, Supabase connection, Supabase reads, Supabase writes, staging rows, production `daily_prices` mutation, TWSE source retrieval, market-data ingestion, source-derived row storage, public source promotion, row coverage points, or `scoreSource=real`.

## Required Human Input

Before any `--apply` command, PM must have these fields from a human reviewer:

- `id`: one of `permitted-use`, `attribution`, `redistribution`, `retention`, `rate-limit-and-outage`, `delay-incompleteness-public-display`, or `derived-score-use`.
- `classification`: one of `accepted_for_local_planning_only`, `accepted_for_internal_only`, `accepted_for_delayed_public_display`, `accepted_for_derived_metrics_only`, `rejected`, or `unknown_keep_blocked`.
- `recordedBy`: one of `CEO`, `Chairman`, `Legal`, or `PM`.
- `recordedAt`: ISO timestamp.
- `note`: concise decision note explaining the human basis without copying provider terms or source payloads.

If any field is missing or unclear, stop and report. Do not infer a favorable classification.

## Step 1: Inspect Current Ledger

Run:

```powershell
node scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs
```

Confirm the target item is still the intended item. Confirm runtime posture remains:

- `publicDataSource` is `mock`;
- `scoreSource` is `mock`;
- source approval status is `not_source_approved`.

## Step 2: Dry-Run The Recording Command

Run the recorder with `--dry-run` first:

```powershell
node scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs --dry-run --id "<id>" --classification "<classification>" --recordedBy "<recordedBy>" --recordedAt "<recordedAt>" --note "<note>"
```

The dry-run must show:

- `status` is `dry_run`;
- safety flags remain false;
- `publicDataSource` remains `mock`;
- `scoreSource` remains `mock`;
- `stillDoesNotAuthorize` includes SQL, Supabase, market data fetch, ingestion, storage, public source promotion, row coverage points, and `scoreSource=real`.

If dry-run fails, stop and report. Do not run `--apply`.

## Step 3: Apply Only After Dry-Run Passes

Only after Step 2 passes and the human classification is still intended, run:

```powershell
node scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs --apply --id "<id>" --classification "<classification>" --recordedBy "<recordedBy>" --recordedAt "<recordedAt>" --note "<note>"
```

This records only a local classification. It does not promote runtime state.

## Step 4: Post-Apply Checks

Immediately after any `--apply`, run:

```powershell
node scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs
node scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs
node scripts/check-readable-current-status.mjs
cmd.exe /c npm run check:json
node scripts/check-review-gates.mjs
```

If any check fails, stop and report before doing more work.

## Stop Lines

Stop and report if:

- requested `id` is not one of the allowed ids;
- requested `classification` is not one of the allowed classifications;
- reviewer tries to record `pending` as a resolved human outcome;
- reviewer asks to copy provider terms or source payloads into the repo;
- reviewer asks to fetch market data;
- reviewer asks to run SQL;
- reviewer asks to connect to Supabase;
- reviewer asks to write Supabase;
- reviewer asks to write staging rows;
- reviewer asks to mutate production `daily_prices`;
- reviewer asks to promote public source;
- reviewer asks to award row coverage points;
- reviewer asks to set `scoreSource=real`;
- dry-run mutates the ledger;
- post-apply checks fail.

## CEO Recommendation

Use this runbook only after a specific human classification exists. The next safe slice may be an apply-runbook role review, or if the chairman supplies a classification, execute exactly one dry-run and one apply for that one classification, then run the post-apply checks.
