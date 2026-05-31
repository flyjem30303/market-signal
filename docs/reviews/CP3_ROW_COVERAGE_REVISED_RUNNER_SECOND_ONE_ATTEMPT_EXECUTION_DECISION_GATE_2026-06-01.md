# CP3 Row Coverage Revised Runner Second One-Attempt Execution Decision Gate

Status: `CP3 row coverage revised runner second one-attempt execution decision gate recorded`

Decision: `AUTHORIZE_NEXT_SLICE_SECOND_ONE_ATTEMPT_ROW_COVERAGE_READONLY_EXECUTION_IF_IMMEDIATE_PRECHECKS_PASS`

Trigger: `CP3 row coverage credential loading command revision recorded`

## Scope

This CEO slice records the decision gate for one possible second row coverage read-only execution attempt using the revised guarded runner. It does not execute the runner, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not change the public data source away from mock, does not set `scoreSource=real`, does not approve public claims, does not award row coverage points, and does not promote CP3 readiness.

## Gate Decision

Current gate status: `ready_for_next_slice_second_one_attempt_row_coverage_execution_decision`.

CEO authorizes the next slice to execute exactly one revised row coverage read-only attempt only if all immediate pre-run checks pass in that same slice. This decision gate is not execution.

## Exact Command To Restate In Execution Slice

```powershell
$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION="CP3_ROW_COVERAGE_READONLY_VALIDATE"; & 'C:\Program Files\nodejs\node.exe' scripts\run-row-coverage-readonly-once.mjs
```

The runner may read `.env.local` after confirmation passes, but only to load `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_DATA_SOURCE` into the current process. Any command drift or runner safety drift stops execution.

## Required Immediate Pre-Run Checks

- PRE-RUN-001 `scripts/check-row-coverage-contract.mjs` must pass.
- PRE-RUN-002 `scripts/check-row-coverage-readonly-validation-contract.mjs` must pass.
- PRE-RUN-003 `scripts/check-row-coverage-readonly-local-preflight.mjs` must pass.
- PRE-RUN-004 `scripts/check-row-coverage-readonly-guarded-runner.mjs` must pass.
- PRE-RUN-005 `scripts/check-row-coverage-readonly-one-attempt-post-run-review.mjs` must pass.
- PRE-RUN-006 `scripts/check-row-coverage-credential-loading-command-revision.mjs` must pass.
- PRE-RUN-007 `scripts/check-review-gates.mjs` must pass.
- PRE-RUN-008 TypeScript noEmit must pass.
- PRE-RUN-009 Next build must pass or the execution slice must explicitly justify why build is skipped.
- PRE-RUN-010 `NEXT_PUBLIC_DATA_SOURCE` must remain `mock`.
- PRE-RUN-011 `.env.local` must remain unchanged.

## One-Attempt Limit

- LIMIT-001 run the revised guarded runner at most once in the execution slice.
- LIMIT-002 do not retry if the run fails.
- LIMIT-003 do not run alternate Supabase validators in the same slice.
- LIMIT-004 do not run SQL, ingestion, write validators, or market-data fetch commands in the same slice.
- LIMIT-005 do not repeat the attempt in a later slice unless a new code or environment boundary changes and a new CEO decision gate is recorded.

## Output Handling

- OUTPUT-001 accept only sanitized JSON from `scripts/run-row-coverage-readonly-once.mjs`.
- OUTPUT-002 allowed fields: `status`, `reason`, `remoteAttempted`, `preflightStatus`, `targetRelation`, `canAwardRowCoveragePoints`, `canClaimCoverage`, `canSetScoreSourceReal`, `connectionAttempted`, `filesWritten`, `mutations`, `publicDataSource`, `rowPayloadsPrinted`, `scoreSource`, `secretsPrinted`, `sqlExecuted`.
- OUTPUT-003 do not print Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data.
- OUTPUT-004 if output contains unexpected fields, stop and record failure without continuing.

## Success Handling

- SUCCESS-001 create a second-attempt post-run review artifact in the same slice.
- SUCCESS-002 record only sanitized outcome fields.
- SUCCESS-003 keep `NEXT_PUBLIC_DATA_SOURCE=mock`.
- SUCCESS-004 keep `scoreSource=real` blocked.
- SUCCESS-005 do not promote CP3 readiness.
- SUCCESS-006 do not approve public claims.
- SUCCESS-007 do not award row coverage points without a separate post-run review acceptance.

## Failure Handling

- FAILURE-001 create a second-attempt post-run review artifact in the same slice.
- FAILURE-002 classify failure as missing credentials, connection error, schema error, runtime error, output-contract failure, or runner skeleton blocked.
- FAILURE-003 do not retry.
- FAILURE-004 keep mock fallback as the user-facing safety baseline.
- FAILURE-005 do not modify `.env.local`.
- FAILURE-006 do not run SQL or write commands to investigate inside the same slice.

## Role Review

CEO finding: This gate is intentionally short and execution-oriented. The preflight environment blocker has been addressed locally, so the next meaningful move is one controlled row coverage read-only attempt.

PM finding: The project is moving at the requested larger-slice pace: one command revision, one decision gate, one bounded attempt, one post-run review.

Engineering finding: The revised runner keeps command-line secrets out of the shell and loads only allowlisted environment keys from `.env.local` after fail-closed confirmation.

QA finding: The same-slice pre-run checks and post-run review keep the one-attempt rule auditable.

Security finding: `.env.local` remains local and unmodified; secrets are named only as key identifiers and never printed as values.

Data finding: Even a successful result proves row coverage reachability only. It does not approve market-data correctness, source-depth readiness, score provenance, public claims, or `scoreSource=real`.

## CEO Verdict

Accepted as the execution decision gate for the revised row coverage runner. The next slice may execute the guarded runner exactly once if all immediate pre-run checks pass. No other Supabase, SQL, write, ingestion, market-data, public-source, row-coverage-award, or score-source-real action is authorized.

## Next Slice

NEXT-SLICE-001 run immediate pre-run checks.
NEXT-SLICE-002 if checks pass, execute `scripts/run-row-coverage-readonly-once.mjs` exactly once with the approved process-only confirmation environment.
NEXT-SLICE-003 create same-slice second-attempt post-run review from sanitized output.
NEXT-SLICE-004 do not promote CP3 readiness, public claims, public data source, row coverage points, or `scoreSource=real`.
