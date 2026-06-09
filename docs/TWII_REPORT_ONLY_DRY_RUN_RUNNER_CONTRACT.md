# TWII Report-Only Dry-Run Runner Contract

Updated: 2026-06-09

Status: `twii_report_only_dry_run_runner_contract_ready_not_implemented`

## Purpose

This contract defines what a future TWII report-only dry-run runner must prove before PM allows it to run.

It is not the runner implementation. It does not fetch data, parse source output, connect to Supabase, run SQL, write staging rows, mutate `daily_prices`, or create a filled candidate artifact.

## Required Runner Behavior

A future runner must:

- accept exactly one PM-reviewed sanitized aggregate-only TWII candidate artifact path;
- execute at most once per named attempt;
- print only aggregate counts, validation labels, and stop-line booleans;
- avoid raw source payloads, row payloads, stock id payloads, URLs with tokens, and secrets;
- write no repository file unless a separate reviewed artifact-output gate authorizes an ignored local output path;
- perform no Supabase read, no Supabase write, and no SQL;
- leave `publicDataSource=mock`;
- leave `scoreSource=mock`;
- exit non-zero only for runtime/checker failure, not for expected data-quality rejection;
- emit a same-slice post-run review summary.

## Required Report Fields

A future report-only runner output must include:

- `attemptId`;
- `artifactPath`;
- `executionMode=report_only`;
- `sourceLane`;
- `expectedRows`;
- `acceptedCandidateRows`;
- `rejectedCandidateRows`;
- `duplicateCandidateRows`;
- `missingCandidateRows`;
- `rawPayloadsPrinted=false`;
- `rowPayloadsPrinted=false`;
- `stockIdPayloadsPrinted=false`;
- `secretsPrinted=false`;
- `supabaseConnectionAttempted=false`;
- `sqlExecuted=false`;
- `dailyPricesMutated=false`;
- `publicDataSource=mock`;
- `scoreSource=mock`.

## Stop Line

No report-only runner is implemented or executed in this slice.

No market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
