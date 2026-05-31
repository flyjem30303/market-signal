# CP3 Row Coverage Final One-Attempt Readonly Execution Decision Gate

Status: `CP3 row coverage final one-attempt readonly execution decision gate recorded`

Decision: `AUTHORIZE_NEXT_SLICE_ONE_ATTEMPT_ROW_COVERAGE_READONLY_EXECUTION_IF_IMMEDIATE_PRECHECKS_PASS`

Trigger: `CP3 row coverage readonly guarded runner recorded`

## Scope

This CEO slice records the final decision gate for a possible next-slice one-attempt row coverage read-only validation. It does not execute the guarded runner, does not set the confirmation value, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not set `scoreSource=real`, does not approve public claims, does not award row coverage points, and does not promote CP3 readiness.

## Gate Decision

Current gate status: `ready_for_next_slice_one_attempt_row_coverage_readonly_execution_decision`.

CEO authorizes the next slice to execute exactly one row coverage read-only validation attempt only if all immediate pre-run checks pass in that same slice. This decision gate is not execution. It is the final non-execution checkpoint before the possible one-attempt run.

## Exact Command To Restate In Execution Slice

```powershell
$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION="CP3_ROW_COVERAGE_READONLY_VALIDATE"; & 'C:\Program Files\nodejs\node.exe' scripts\run-row-coverage-readonly-once.mjs
```

The execution slice must restate this exact command before running it. Any command drift stops execution.

## Required Immediate Pre-Run Checks

- PRE-RUN-001 `scripts/check-row-coverage-contract.mjs` must pass.
- PRE-RUN-002 `scripts/check-row-coverage-readonly-validation-contract.mjs` must pass.
- PRE-RUN-003 `scripts/check-row-coverage-readonly-local-preflight.mjs` must pass.
- PRE-RUN-004 `scripts/check-row-coverage-readonly-guarded-runner.mjs` must pass.
- PRE-RUN-005 `scripts/check-review-gates.mjs` must pass.
- PRE-RUN-006 TypeScript noEmit must pass.
- PRE-RUN-007 Next build must pass or the execution slice must explicitly justify why build is skipped.
- PRE-RUN-008 `NEXT_PUBLIC_DATA_SOURCE` must remain `mock`.
- PRE-RUN-009 `.env.local` must remain unchanged.

## One-Attempt Limit

- LIMIT-001 run the guarded runner at most once in the execution slice.
- LIMIT-002 do not retry if the run fails.
- LIMIT-003 do not run alternate Supabase validators in the same slice.
- LIMIT-004 do not run SQL, ingestion, write validators, or market-data fetch commands in the same slice.
- LIMIT-005 do not repeat the attempt in a later slice unless a new code or environment boundary changes and a new CEO decision gate is recorded.

## Output Handling

- OUTPUT-001 accept only sanitized JSON from `scripts/run-row-coverage-readonly-once.mjs`.
- OUTPUT-002 allowed fields: `status`, `reason`, `remoteAttempted`, `targetRelation`, `canAwardRowCoveragePoints`, `canClaimCoverage`, `canSetScoreSourceReal`, `connectionAttempted`, `filesWritten`, `mutations`, `publicDataSource`, `rowPayloadsPrinted`, `scoreSource`, `secretsPrinted`, `sqlExecuted`.
- OUTPUT-003 do not print Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data.
- OUTPUT-004 if output contains unexpected fields, stop and record failure without continuing.

## Success Handling

- SUCCESS-001 create a post-run review artifact in the same slice.
- SUCCESS-002 record only sanitized outcome categories.
- SUCCESS-003 keep `NEXT_PUBLIC_DATA_SOURCE=mock`.
- SUCCESS-004 keep `scoreSource=real` blocked.
- SUCCESS-005 do not promote CP3 readiness.
- SUCCESS-006 do not approve public claims.
- SUCCESS-007 do not award row coverage points until a separate post-run review accepts the evidence.

## Failure Handling

- FAILURE-001 create a post-run review artifact in the same slice.
- FAILURE-002 classify failure as missing confirmation, preflight blocked, connection error, schema error, runtime error, or output-contract failure.
- FAILURE-003 do not retry.
- FAILURE-004 keep mock fallback as the user-facing safety baseline.
- FAILURE-005 do not modify `.env.local`.
- FAILURE-006 do not run SQL or write commands to investigate inside the same slice.

## Rollback Confirmation

- ROLLBACK-001 process-only environment values end when the command exits.
- ROLLBACK-002 expected baseline after execution is `NEXT_PUBLIC_DATA_SOURCE=mock`.
- ROLLBACK-003 public data source remains mock.
- ROLLBACK-004 score source real remains blocked.
- ROLLBACK-005 row coverage awarded points remain zero unless a separate post-run review changes the contract.

## Role Review

CEO finding: This gate is sufficient to allow a next-slice one-attempt row coverage read-only execution if checks pass immediately before execution.

PM finding: The project can now move from row coverage preparation to one bounded operational attempt without adding another planning layer.

Engineering finding: The guarded runner is fail-closed and the exact command is stable. Command drift, output drift, or gate failure must stop execution.

QA finding: One-attempt, no-retry, same-slice post-run review, and sanitized-output constraints are explicit.

Security finding: Secrets, raw rows, SQL, writes, `.env.local` mutation, and public source switching remain blocked.

Data finding: Even a successful run proves only row coverage reachability against the defined target. It does not validate market-data correctness, source-depth readiness, or model credibility.

## CEO Verdict

Accepted as the final non-execution gate. The next slice may execute the guarded runner exactly once if all immediate pre-run checks pass. No other Supabase, SQL, write, ingestion, or market-data action is authorized.

## Next Slice

NEXT-SLICE-001 run immediate pre-run checks.
NEXT-SLICE-002 if checks pass, execute `scripts/run-row-coverage-readonly-once.mjs` exactly once with the approved process-only environment.
NEXT-SLICE-003 create same-slice post-run review from sanitized output.
NEXT-SLICE-004 do not promote CP3 readiness, public claims, public data source, row coverage points, or `scoreSource=real`.
