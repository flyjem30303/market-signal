# Data Authorization Decision Packet

Updated: 2026-06-06

Status: `ready_for_chairman_or_ceo_review_not_executed`.

This packet prepares exactly one bounded Supabase readonly row coverage attempt. It is a review packet only. It does not execute the command, connect to Supabase, run SQL, write data, fetch market data, print secrets, change public runtime source, or enable real scoring.

## Trigger

This packet follows `docs/DATA_AUTHORIZATION_ENTRY_GATE.md`.

CEO recommendation: move from broad local preparation to one clear go/no-go decision for a bounded readonly attempt.

## Exact Command

The exact command for a future approved attempt is:

```powershell
$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION='CP3_ROW_COVERAGE_READONLY_VALIDATE'; node scripts/run-row-coverage-readonly-once.mjs
```

Command drift stops execution. Do not run through `scripts/check-review-gates.mjs`. Do not pipe or redirect output to a file.

## Attempt Scope

- Attempt count: exactly one.
- Access type: readonly only.
- Target runner: `scripts/run-row-coverage-readonly-once.mjs`.
- Purpose: aggregate row coverage validation for the current MVP symbol set.
- Expected output type: sanitized aggregate JSON only.
- Allowed symbols: `TWII`, `0050`, `006208`, `2330`, `2382`, `2308`.
- Expected rows: aggregate counts only; no row payloads, no `stock_id` values, no key prefixes, no key suffixes, no key lengths.

## Allowed If Accepted

- Load the minimum existing environment values needed by the guarded runner.
- Connect to Supabase for one readonly count attempt.
- Read aggregate counts from the runner's locked readonly path.
- Immediately record a sanitized post-run review from the terminal output.

## Still Blocked If Accepted

- SQL execution.
- Supabase writes.
- Create staging rows.
- Modify daily_prices.
- Fetch, ingest, store, or commit raw market data.
- Print secrets or raw payloads.
- Run a retry without a new explicit decision.
- Promote `publicDataSource=supabase`.
- Set `scoreSource=real`.
- Award row coverage points before post-run review acceptance.
- Make investment advice, recommendation, ranking, model-confidence, or performance claims.

## Pre-Run Checklist

- `scripts/check-data-authorization-entry-gate.mjs` passes.
- `scripts/check-bounded-row-coverage-readonly-attempt-decision.mjs` passes.
- `scripts/check-row-coverage-second-attempt-final-local-preflight.mjs` passes.
- `scripts/check-row-coverage-second-attempt-sanitized-output-contract.mjs` passes.
- `scripts/check-row-coverage-second-attempt-post-run-acceptance-gate.mjs` passes.
- `scripts/check-review-gates.mjs` passes before execution.
- Chairman or CEO explicitly accepts this exact packet immediately before execution.

## Required Post-Run Review

The same work slice that runs the command must immediately record a post-run review with:

- status;
- remoteAttempted;
- connectionAttempted;
- coverageStatus;
- reason;
- observedTotalRows;
- expectedTotalRows;
- missingRows;
- symbolsChecked count only;
- sqlExecuted false;
- mutations false;
- filesWritten false;
- secretsPrinted false;
- rowPayloadsPrinted false;
- publicDataSource remains mock;
- scoreSource remains mock;
- no retry was executed;
- no promotion by itself.

## Decision

Current packet decision: `ready_for_chairman_or_ceo_review_not_executed`.

Execution decision remains pending until the chairman or CEO explicitly accepts this packet and asks for the bounded readonly attempt in the current execution context.
