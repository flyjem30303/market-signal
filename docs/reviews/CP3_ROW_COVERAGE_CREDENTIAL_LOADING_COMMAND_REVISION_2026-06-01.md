# CP3 Row Coverage Credential Loading Command Revision

Status: `CP3 row coverage credential loading command revision recorded`

Decision: `REVISE_ROW_COVERAGE_RUNNER_TO_LOAD_DOTENV_LOCAL_PROCESS_ONLY_WITHOUT_EXECUTION`

Trigger: `CP3 row coverage readonly one-attempt post-run review recorded`

## Scope

This CEO slice revises the row coverage read-only path after the one-attempt post-run result `preflight_blocked`. It does not retry the remote read, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not change the public data source away from mock, does not set `scoreSource=real`, does not approve public claims, does not award row coverage points, and does not promote CP3 readiness.

## Revision

The guarded runner now loads only these environment keys from `.env.local` into the current process after the missing-confirmation fail-closed gate passes:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_DATA_SOURCE`

The loader only fills missing process env values, never prints values, never writes `.env.local`, and never changes public runtime gates. `NEXT_PUBLIC_DATA_SOURCE` must still resolve to `mock`, and `ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION` must still match the CEO approval token before the runner reads `.env.local`.

## Command Shape

The next execution command remains process-only for the explicit CEO confirmation:

```powershell
$env:ROW_COVERAGE_READONLY_VALIDATE_CONFIRMATION="CP3_ROW_COVERAGE_READONLY_VALIDATE"; & 'C:\Program Files\nodejs\node.exe' scripts\run-row-coverage-readonly-once.mjs
```

The difference is inside the runner: after confirmation passes, it may read `.env.local` locally and load only the allowed keys into the process without printing them.

## Safety Assertions

- SAFE-001 runner still exits before reading `.env.local` when confirmation is missing.
- SAFE-002 runner still exits before local preflight import when confirmation is missing.
- SAFE-003 runner loads only `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_DATA_SOURCE`.
- SAFE-004 runner does not print credential values or presence details.
- SAFE-005 runner does not modify `.env.local`.
- SAFE-006 runner does not contain SQL text.
- SAFE-007 runner does not call write, insert, update, delete, upsert, rpc, or storage APIs.
- SAFE-008 runner output remains sanitized and allowlisted.
- SAFE-009 runner still blocks row coverage point awards.
- SAFE-010 runner still blocks `scoreSource=real`.

## Role Review

CEO finding: This is the right acceleration point. The prior failure was narrow and operational, so the fix should be a bounded runner revision instead of another long planning chain.

PM finding: The next remote attempt is not authorized in this slice. The project now has a concrete implementation change that removes the incomplete preflight environment blocker.

Engineering finding: Loading `.env.local` inside the runner after fail-closed confirmation avoids exposing secrets in command text and keeps environment mutation process-local.

QA finding: The checker must prove fail-closed behavior without confirmation and prove that the credential loader is allowlisted.

Security finding: Secrets remain local, unprinted, uncommitted, and outside docs. The code may name key identifiers, but must not include values.

Data finding: This revision still does not validate row coverage, data quality, source-depth readiness, score provenance, or public claims.

## CEO Verdict

Accepted as a non-execution credential-loading command revision. A second row coverage read-only attempt remains blocked until a new one-attempt execution decision gate is recorded after local checks pass.

## Next Slice

NEXT-SLICE-001 create a new one-attempt execution decision gate for the revised row coverage runner if all local checks pass.
NEXT-SLICE-002 run immediate pre-run checks again before any second remote attempt.
NEXT-SLICE-003 execute at most one revised guarded row coverage read-only attempt only after the new gate exists.
NEXT-SLICE-004 create a new post-run review from sanitized output.
