# Post-Equity Row Coverage Readonly Attempt Decision Packet

Status: `post_equity_row_coverage_readonly_attempt_decision_packet_recorded`

Date: 2026-06-01

## Trigger

`EQUITY_ROW_COVERAGE_EVIDENCE_ACCEPTANCE_GATE_2026-06-01.md` accepted the clean equity report-only sample as local decision-quality evidence only. `scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs` now includes that equity evidence as a prerequisite.

## Decision State

```text
decision_state: ready_for_explicit_one_attempt_action
execution_approved_by_this_packet: false
required_next_user_action: accept_one_bounded_row_coverage_readonly_attempt
attempt_limit: 1
```

## Current Readiness Evidence

```text
row_coverage_evidence_acceptance: ok
equity_row_coverage_evidence_acceptance_gate: ok
bounded_row_coverage_readonly_attempt_decision: ok
prior_count_unavailable_diagnostic: recorded
query_contract_revision: stock_id counting via stocks.symbol mapping
publicDataSource: mock
scoreSource: mock
```

## Exact Future Command If Accepted

```text
$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION="CP3_ROW_COVERAGE_READONLY_VALIDATE"; & 'C:\Program Files\nodejs\node.exe' scripts\run-row-coverage-readonly-once.mjs
```

## Required Immediate Prechecks

1. `npm run check:row-coverage-readonly-guarded-runner`
2. `npm run check:row-coverage-evidence-acceptance`
3. `npm run check:equity-row-coverage-evidence-acceptance-gate`
4. `npm run check:bounded-row-coverage-readonly-attempt-decision`
5. `npm run check:post-equity-row-coverage-readonly-attempt-decision-packet`
6. `npm run check:review-gates`

## Allowed Future Output

The future output, if the attempt is separately accepted, may include only sanitized aggregate fields:

```text
mode: row_coverage_readonly_remote_validation
targetRelation: daily_prices
expectedSymbolCount: 6
requiredTradingSessions: 60
expectedTotalRows: 360
observedTotalRows: number
missingRows: number
symbolsChecked: sanitized symbol identifiers and aggregate observedRows only
coverageStatus: ok or blocked
remoteAttempted: true
connectionAttempted: true
filesWritten: false
mutations: false
sqlExecuted: false
secretsPrinted: false
rowPayloadsPrinted: false
publicDataSource: mock
scoreSource: mock
canAwardRowCoveragePoints: false
canClaimCoverage: false
canSetScoreSourceReal: false
```

## Stop Lines

- This packet does not execute the runner.
- This packet does not approve execution by itself.
- Do not run more than one bounded readonly attempt from a future acceptance.
- Do not run SQL.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch or ingest raw market data.
- Do not print secrets.
- Do not print row payloads.
- Do not print stock_id payloads.
- Do not award row coverage points.
- Do not promote `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not promote CP3 readiness.
- Do not approve public coverage claims.

## CEO/PM Recommendation

```text
REQUEST_EXPLICIT_ACCEPTANCE_FOR_ONE_BOUNDED_READONLY_ATTEMPT
```

CEO recommends one bounded row coverage readonly attempt as the next named action, because local evidence and query-contract hardening are ready. The attempt should be followed immediately by a post-run review before any readiness or runtime state change.
