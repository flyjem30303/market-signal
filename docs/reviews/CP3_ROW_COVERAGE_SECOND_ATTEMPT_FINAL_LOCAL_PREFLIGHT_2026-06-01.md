# CP3 Row Coverage Second Attempt Final Local Preflight

Status: `CP3 row coverage second attempt final local preflight recorded`

Decision: `SECOND_ATTEMPT_LOCALLY_READY_REMOTE_EXECUTION_STILL_PAUSED`

Trigger: `CP3 row coverage query contract revision implementation review recorded`

## Scope

This preflight records the final local-only readiness state before any future second Supabase readonly row coverage attempt. It does not run the confirmed command, does not set the confirmation environment variable, does not connect to Supabase, does not run SQL, does not write Supabase, does not write staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not print secrets, does not output row payloads, does not print `stock_id` values, does not set `scoreSource=real`, does not award row coverage points, does not approve public claims, and does not promote CP3 readiness.

## Required Pre-Execution State

```text
STATE-001 publicDataSource remains mock
STATE-002 scoreSource remains mock
STATE-003 CP3 remains not_ready
STATE-004 row coverage points remain unawarded
STATE-005 public claims remain blocked
STATE-006 first row coverage remote attempt remains blocked
STATE-007 second row coverage remote attempt has not executed in this slice
STATE-008 Git backup remains paused under current instruction
```

## Query Contract Lock

```text
QUERY-001 runner resolves stocks.symbol to stocks.id before counting daily_prices
QUERY-002 runner queries stocks with .select("id, symbol")
QUERY-003 runner filters stocks with .in("symbol", ALLOWED_SYMBOLS)
QUERY-004 runner counts daily_prices with .select("stock_id", { count: "exact", head: true })
QUERY-005 runner filters daily_prices with .eq("stock_id", stockId)
QUERY-006 runner must not count daily_prices by symbol
QUERY-007 runner must not filter daily_prices with .eq("symbol", symbol)
QUERY-008 stock_id values remain internal and hidden from output
```

## One-Attempt Control

```text
ATTEMPT-001 future execution must use ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION exactly
ATTEMPT-002 future execution must run scripts/run-row-coverage-readonly-once.mjs directly
ATTEMPT-003 future execution must run at most once
ATTEMPT-004 future execution must not be launched through scripts/check-review-gates.mjs
ATTEMPT-005 future execution must not pipe output to a file
ATTEMPT-006 future execution must not redirect output to a file
ATTEMPT-007 future execution must not print environment values
ATTEMPT-008 future execution must not print key prefixes, suffixes, or lengths
ATTEMPT-009 future execution must be followed immediately by a sanitized post-run review
ATTEMPT-010 future execution remains paused until explicit active approval
```

## Role Review

```text
CEO-FINDING-001 local preparation is sufficient; governance should stop expanding before the next remote read decision
CEO-FINDING-002 the next meaningful business move is one controlled readonly attempt, not more local process layering
PM-FINDING-001 this packet gives a clear go/no-go checkpoint for the chairman or CEO delegate
PM-FINDING-002 no Git backup work is required during the away/autonomy stage
ENGINEERING-FINDING-001 query contract is now aligned with local schema evidence
ENGINEERING-FINDING-002 static gates reject the previous daily_prices.symbol path
DATA-FINDING-001 missing stock mapping and missing price rows are distinct outcomes
SECURITY-FINDING-001 output remains aggregate and sanitized
LEGAL-PUBLIC-CLAIMS-FINDING-001 no public claim changes are allowed before post-run review acceptance
```

## Verification Expectations

```text
scripts/check-row-coverage-second-attempt-final-local-preflight.mjs passes
scripts/check-row-coverage-query-contract-revision-implementation-review.mjs passes
scripts/check-row-coverage-readonly-guarded-runner.mjs passes
scripts/check-row-coverage-remote-capable-runner-one-attempt-execution-decision-gate.mjs passes
scripts/check-review-gates.mjs passes
Next build passes
localhost health passes after dev recovery when needed
no second remote attempt occurs
SQL execution remains blocked
Supabase writes remain blocked
```

## CEO Next Decision

```text
NEXT-DECISION-001 if the user returns and asks for Supabase readonly attempt, report this preflight first
NEXT-DECISION-002 if explicit approval is active, execute exactly one readonly attempt
NEXT-DECISION-003 after execution, immediately create post-run review before any readiness or scoring change
NEXT-DECISION-004 keep public data source mock until a separate runtime activation gate accepts evidence
NEXT-DECISION-005 keep scoreSource mock until a separate score-source gate accepts evidence
```
