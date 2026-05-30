# CP3 Freshness Runtime Read Once Guarded Runner

Status: `CP3 freshness runtime read once guarded runner recorded`

Decision: `IMPLEMENT_FAIL_CLOSED_GUARDED_RUNNER_WITHOUT_EXECUTION`

Trigger: `CP3 freshness exact one-attempt read-only activation command map recorded`

## Scope

This larger CEO implementation slice creates the guarded runner target for a future one-attempt freshness read-only runtime activation. It verifies fail-closed behavior without the confirmation value. It does not execute the approved command, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Implemented Artifact

- `scripts/run-freshness-runtime-read-once.mjs`

## Safety Properties

- RUNNER-001 exits before loading the runtime wrapper when `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION` is missing.
- RUNNER-002 requires `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT`.
- RUNNER-003 requires `NEXT_PUBLIC_DATA_SOURCE=mock`.
- RUNNER-004 requires `DATA_FRESHNESS_SOURCE=supabase`.
- RUNNER-005 requires `DATA_FRESHNESS_SUPABASE_READS=enabled`.
- RUNNER-006 uses process-only environment values.
- RUNNER-007 does not edit `.env.local`.
- RUNNER-008 does not contain SQL command text.
- RUNNER-009 does not call write, insert, update, delete, upsert, rpc, or storage APIs.
- RUNNER-010 prints only sanitized JSON fields.
- RUNNER-011 does not print Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data.
- RUNNER-012 classifies errors into broad categories only.

## Local Verification

- VERIFY-001 running `scripts/run-freshness-runtime-read-once.mjs` without confirmation returns `status=blocked`.
- VERIFY-002 fail-closed verification returns `remoteAttempted=false`.
- VERIFY-003 fail-closed verification returns `reason=missing_confirmation`.
- VERIFY-004 no confirmation test does not load the runtime wrapper.
- VERIFY-005 no confirmation test does not connect to Supabase.

## Role Review

CEO finding: This is the right acceleration step because it turns the command map into a concrete guarded runner while still keeping execution blocked.

PM finding: The project now has a future execution target, a fail-closed behavior, and an auditable safety checker in one slice.

Engineering finding: The runner delays runtime wrapper loading until all gates pass, which keeps local fail-closed testing safe.

QA finding: The no-confirmation path is testable without credentials and proves the default behavior is blocked.

Security finding: The runner avoids secret output and row payload output by allowlisting sanitized fields.

Data finding: Any future successful run remains freshness metadata only and does not promote market-data quality or source-depth readiness.

## CEO Verdict

Accepted as guarded runner implementation only. Do not execute with the confirmation value yet. The next slice may prepare a final execution-decision gate that repeats the exact command, pre-run checks, rollback, and post-run artifact requirement.

## Next Slice

NEXT-SLICE-001 prepare final one-attempt freshness runtime execution decision gate.
NEXT-SLICE-002 require immediate pre-run checks before any confirmed execution.
NEXT-SLICE-003 do not promote CP3 readiness, public claims, public data source, or scoreSource real from runner implementation alone.
