# CP3 Freshness Exact One-Attempt Read-Only Activation Command Map

Status: `CP3 freshness exact one-attempt read-only activation command map recorded`

Decision: `DRAFT_EXACT_ONE_ATTEMPT_READONLY_ACTIVATION_COMMAND_WITHOUT_EXECUTION`

Trigger: `CP3 freshness read-only runtime activation readiness packet recorded`

## Scope

This larger CEO slice records the exact future command boundary for one possible freshness read-only runtime activation attempt. It does not execute the command, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Exact Future Command Shape

Command status: `drafted_not_approved_for_execution`

Command target: `scripts/run-freshness-runtime-read-once.mjs`

Execution shell: `PowerShell`

Process-only environment values:

- `DATA_FRESHNESS_SOURCE=supabase`
- `DATA_FRESHNESS_SUPABASE_READS=enabled`
- `NEXT_PUBLIC_DATA_SOURCE=mock`
- `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT`

Descriptive command:

```powershell
$env:DATA_FRESHNESS_SOURCE="supabase"; $env:DATA_FRESHNESS_SUPABASE_READS="enabled"; $env:NEXT_PUBLIC_DATA_SOURCE="mock"; $env:FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION="CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT"; & 'C:\Program Files\nodejs\node.exe' scripts\run-freshness-runtime-read-once.mjs
```

This command is not executed in this slice. The command target is not implemented in this slice. A later slice must create a guarded runner and a post-run review checker before execution can be considered.

## Required Immediate Pre-Run Checks

- PRE-RUN-001 `scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs` must pass immediately before the attempt.
- PRE-RUN-002 `scripts/check-cp3-freshness-readonly-runtime-activation-readiness-packet.mjs` must pass immediately before the attempt.
- PRE-RUN-003 `scripts/check-review-gates.mjs` must pass immediately before the attempt.
- PRE-RUN-004 the guarded runner target must exist and must fail closed without `FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION`.
- PRE-RUN-005 the guarded runner must not contain SQL strings.
- PRE-RUN-006 the guarded runner must not call write, insert, update, delete, upsert, rpc, or storage APIs.
- PRE-RUN-007 the guarded runner must redact secrets and row payloads.
- PRE-RUN-008 CEO must restate the exact command and one-attempt limit in the execution slice.

## Expected Output Boundary

- OUTPUT-001 only sanitized status fields may be printed.
- OUTPUT-002 output may include freshness state, source label, mock fallback flag, and error category.
- OUTPUT-003 output must not include Supabase URL, service role key, anon key, row payloads, SQL text, or raw market data.
- OUTPUT-004 output must be followed by a post-run review artifact before any next runtime decision.

## Rollback Boundary

- ROLLBACK-001 command uses process-only env and must not modify `.env.local`.
- ROLLBACK-002 after the process exits, expected baseline is `DATA_FRESHNESS_SOURCE=mock`.
- ROLLBACK-003 after the process exits, expected baseline is `DATA_FRESHNESS_SUPABASE_READS=disabled`.
- ROLLBACK-004 public data source remains `mock`.
- ROLLBACK-005 score source real promotion remains blocked.

## Stop Conditions

- STOP-001 guarded runner is missing.
- STOP-002 guarded runner cannot prove fail-closed confirmation behavior.
- STOP-003 any command includes SQL.
- STOP-004 any command includes writes, ingestion, or market-data fetch.
- STOP-005 any command changes `.env.local`.
- STOP-006 any command changes `NEXT_PUBLIC_DATA_SOURCE` away from `mock`.
- STOP-007 any command prints secrets, row payloads, or raw market data.
- STOP-008 review gates fail immediately before execution.

## Role Review

CEO finding: This command map is concrete enough to support the next implementation slice, but execution remains blocked.

PM finding: The work is now moving at the right speed: one larger artifact names command target, env, confirmation, checks, rollback, and stop conditions together.

Engineering finding: The next useful implementation is a guarded runner that imports the runtime wrapper, fails closed without confirmation, emits only sanitized status, and never includes SQL or write paths.

QA finding: The command map gives testable acceptance criteria for the guarded runner before any remote attempt.

Security finding: Secrets, row payloads, `.env.local` mutation, public source switching, and write methods remain blocked.

Data finding: A successful freshness read-only attempt would only prove metadata reachability. It would not prove market data quality, source-depth readiness, or public claim readiness.

## CEO Verdict

Accepted as a draft command map only. The next slice should implement a local fail-closed guarded runner and static safety checker. Do not execute the command until that runner, safety checker, review gates, and a separate execution decision pass.

## Next Slice

NEXT-SLICE-001 implement `scripts/run-freshness-runtime-read-once.mjs` as a fail-closed guarded runner.
NEXT-SLICE-002 add a checker that proves the runner requires confirmation, uses process-only env, has no SQL, has no writes, and redacts output.
NEXT-SLICE-003 wire the checker into `scripts/check-review-gates.mjs`.
NEXT-SLICE-004 do not execute the guarded runner in the implementation slice.
