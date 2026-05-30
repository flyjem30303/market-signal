# CP3 Freshness Credential Loading Command Revision

Status: `CP3 freshness credential loading command revision recorded`

Decision: `REVISE_RUNNER_TO_LOAD_DOTENV_LOCAL_PROCESS_ONLY_WITHOUT_EXECUTION`

Trigger: `CP3 freshness runtime read once execution post-run review recorded`

## Scope

This CEO slice revises the freshness runtime read path after the one-attempt post-run result `missing_supabase_credentials`. It does not retry the remote read, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not change the public data source away from mock, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Revision

The guarded runner now loads only these credential keys from `.env.local` into the current process after all fail-closed runtime gates pass:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

The loader only fills missing process env values, never prints values, never writes `.env.local`, and never changes public runtime gates. `NEXT_PUBLIC_DATA_SOURCE` must still be `mock`; `DATA_FRESHNESS_SOURCE` and `DATA_FRESHNESS_SUPABASE_READS` must still be explicit process-only execution values; and `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION` must still match the CEO approval token.

## Command Shape

The next execution command remains process-only for runtime gates:

```powershell
$env:DATA_FRESHNESS_SOURCE="supabase"; $env:DATA_FRESHNESS_SUPABASE_READS="enabled"; $env:NEXT_PUBLIC_DATA_SOURCE="mock"; $env:FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION="CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT"; & 'C:\Program Files\nodejs\node.exe' scripts\run-freshness-runtime-read-once.mjs
```

The difference is inside the runner: after confirmation and mock-source gates pass, it may read `.env.local` locally and load only the two credential keys into the process without printing them.

## Safety Assertions

- SAFE-001 runner still exits before reading `.env.local` when confirmation is missing.
- SAFE-002 runner still exits before runtime wrapper import when `NEXT_PUBLIC_DATA_SOURCE` is not `mock`.
- SAFE-003 runner still exits before runtime wrapper import when freshness Supabase gates are not explicitly enabled.
- SAFE-004 runner loads only `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- SAFE-005 runner does not load anon key because the server freshness path uses service role only.
- SAFE-006 runner does not print credential values or presence details.
- SAFE-007 runner does not modify `.env.local`.
- SAFE-008 runner does not contain SQL text.
- SAFE-009 runner does not call write, insert, update, delete, upsert, rpc, or storage APIs.
- SAFE-010 runner output remains sanitized and allowlisted.

## Role Review

CEO finding: This is the right acceleration point. The prior failure was narrow and operational, so the fix should be a bounded runner revision instead of another long planning chain.

PM finding: The next remote attempt is not authorized in this slice. The project now has a concrete implementation change that removes the missing-credentials blocker.

Engineering finding: Loading `.env.local` inside the runner after fail-closed gates avoids exposing secrets in command text and keeps environment mutation process-local.

QA finding: The checker must prove fail-closed behavior without confirmation and prove that the credential loader is allowlisted.

Security finding: Secrets remain local, unprinted, uncommitted, and outside docs. The code may name key identifiers, but must not include values.

Data finding: This revision still does not validate data quality, freshness correctness, score provenance, or public claims.

## CEO Verdict

Accepted as a non-execution credential-loading command revision. A second remote attempt remains blocked until a new one-attempt execution decision gate is recorded after local checks pass.

## Next Slice

NEXT-SLICE-001 create a new one-attempt execution decision gate for the revised runner if all local checks pass.
NEXT-SLICE-002 run immediate pre-run checks again before any second remote attempt.
NEXT-SLICE-003 execute at most one revised guarded runtime read attempt only after the new gate exists.
NEXT-SLICE-004 create a new post-run review from sanitized output.
