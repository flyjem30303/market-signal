# CP3 Freshness Revised Runner Second One-Attempt Execution Decision Gate

Status: `CP3 freshness revised runner second one-attempt execution decision gate recorded`

Decision: `AUTHORIZE_NEXT_SLICE_SECOND_ONE_ATTEMPT_READONLY_EXECUTION_IF_IMMEDIATE_PRECHECKS_PASS`

Trigger: `CP3 freshness credential loading command revision recorded`

## Scope

This CEO slice records the decision gate for one possible second freshness read-only runtime execution attempt using the revised guarded runner. It does not execute the runner, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not change the public data source away from mock, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Gate Decision

Current gate status: `ready_for_next_slice_second_one_attempt_execution_decision`.

CEO authorizes the next slice to execute exactly one revised read-only freshness runtime attempt only if all immediate pre-run checks pass in that same slice. This decision gate is not execution.

## Exact Command To Restate In Execution Slice

```powershell
$env:DATA_FRESHNESS_SOURCE="supabase"; $env:DATA_FRESHNESS_SUPABASE_READS="enabled"; $env:NEXT_PUBLIC_DATA_SOURCE="mock"; $env:FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION="CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT"; & 'C:\Program Files\nodejs\node.exe' scripts\run-freshness-runtime-read-once.mjs
```

The runner may read `.env.local` after confirmation and runtime gates pass, but only to load `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` into the current process. Any command drift or runner safety drift stops execution.

## Required Immediate Pre-Run Checks

- PRE-RUN-001 `scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs` must pass.
- PRE-RUN-002 `scripts/check-cp3-freshness-readonly-runtime-activation-readiness-packet.mjs` must pass.
- PRE-RUN-003 `scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs` must pass.
- PRE-RUN-004 `scripts/check-cp3-freshness-runtime-read-once-execution-post-run-review.mjs` must pass.
- PRE-RUN-005 `scripts/check-cp3-freshness-credential-loading-command-revision.mjs` must pass.
- PRE-RUN-006 `scripts/check-review-gates.mjs` must pass.
- PRE-RUN-007 TypeScript noEmit must pass.
- PRE-RUN-008 Next build must pass or the execution slice must explicitly justify why build is skipped.
- PRE-RUN-009 `NEXT_PUBLIC_DATA_SOURCE` must remain `mock`.
- PRE-RUN-010 `.env.local` must remain unchanged.

## One-Attempt Limit

- LIMIT-001 run the revised guarded runner at most once in the execution slice.
- LIMIT-002 do not retry if the run fails.
- LIMIT-003 do not run alternate Supabase validators in the same slice.
- LIMIT-004 do not run SQL, ingestion, write validators, or market-data fetch commands in the same slice.
- LIMIT-005 do not repeat the attempt in a later slice unless a new code or environment boundary changes and a new CEO decision gate is recorded.

## Output Handling

- OUTPUT-001 accept only sanitized JSON from `scripts/run-freshness-runtime-read-once.mjs`.
- OUTPUT-002 allowed fields: `status`, `reason`, `remoteAttempted`, `errorCategory`, `state`, `sourceName`, `isMock`, `scoreSource`, `market`, `asOfDate`.
- OUTPUT-003 do not print Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data.
- OUTPUT-004 if output contains unexpected fields, stop and record failure without continuing.

## Success Handling

- SUCCESS-001 create a second-attempt post-run review artifact in the same slice.
- SUCCESS-002 record only sanitized outcome fields.
- SUCCESS-003 keep `NEXT_PUBLIC_DATA_SOURCE=mock`.
- SUCCESS-004 keep `scoreSource=real` blocked.
- SUCCESS-005 do not promote CP3 readiness.
- SUCCESS-006 do not approve public claims.
- SUCCESS-007 do not treat freshness metadata reachability as market-data quality approval.

## Failure Handling

- FAILURE-001 create a second-attempt post-run review artifact in the same slice.
- FAILURE-002 classify failure as missing credentials, connection error, schema error, runtime error, or output-contract failure.
- FAILURE-003 do not retry.
- FAILURE-004 keep mock fallback as the user-facing safety baseline.
- FAILURE-005 do not modify `.env.local`.
- FAILURE-006 do not run SQL or write commands to investigate inside the same slice.

## Role Review

CEO finding: This gate is intentionally short and execution-oriented. The credential-loading blocker has been addressed locally, so the next meaningful move is one controlled read-only runtime attempt.

PM finding: The project is now moving at the requested larger-slice pace: one decision gate, one execution attempt, one post-run review.

Engineering finding: The revised runner keeps command-line secrets out of the shell and loads only the two server-side keys from `.env.local` after fail-closed gates.

QA finding: The same-slice pre-run checks and post-run review keep the one-attempt rule auditable.

Security finding: `.env.local` remains local and unmodified; secrets are named only as key identifiers and never printed as values.

Data finding: Even a successful result proves freshness metadata reachability only. It does not approve market-data correctness, score provenance, public claims, or `scoreSource=real`.

## CEO Verdict

Accepted as the execution decision gate for the revised runner. The next slice may execute the guarded runner exactly once if all immediate pre-run checks pass. No other Supabase, SQL, write, ingestion, market-data, public-source, or score-source-real action is authorized.

## Next Slice

NEXT-SLICE-001 run immediate pre-run checks.
NEXT-SLICE-002 if checks pass, execute `scripts/run-freshness-runtime-read-once.mjs` exactly once with the approved process-only runtime gate environment.
NEXT-SLICE-003 create same-slice second-attempt post-run review from sanitized output.
NEXT-SLICE-004 do not promote CP3 readiness, public claims, public data source, or `scoreSource=real`.
