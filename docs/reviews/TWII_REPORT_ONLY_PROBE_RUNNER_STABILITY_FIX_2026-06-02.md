# TWII Report-Only Probe Runner Stability Fix

Status: `twii_report_only_probe_runner_stability_fix_recorded`

Date: 2026-06-02

## Trigger

`TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-06-02.md` recorded that the single TWII report-only probe emitted sanitized JSON but the Windows Node process ended with `UV_HANDLE_CLOSING` after output.

## Local-Only Fix

```text
runner: scripts/run-twii-report-only-probe-once.mjs
fix_scope: local_process_tail_stability_only
process_exit_removed: true
process_exitCode_used: true
settle_before_exit_added: true
remote_attempt_reused: false
publicDataSource: mock
scoreSource: mock
```

## Implementation Notes

The runner now sets `process.exitCode` instead of calling `process.exit(...)`. It also awaits one `setImmediate` tick through `settleBeforeExit()` so Node can flush stdout and release internal fetch handles naturally.

This fix is intended to prevent the Windows `UV_HANDLE_CLOSING` tail assertion observed after the sanitized output was already emitted. It does not change the target source, output contract, confirmation token, row parsing logic, or score/data-source boundary.

## Verification

```text
VERIFY-001 guarded runner fail-closed check passes without confirmation
VERIFY-002 fail-closed output remains sanitized JSON
VERIFY-003 fail-closed output exits with code 1
VERIFY-004 review gate still does not execute the TWII probe runner
VERIFY-005 no new remote attempt is executed by this fix
```

## Explicit Non-Authorization

- This fix does not run SQL.
- This fix does not connect to Supabase.
- This fix does not write Supabase.
- This fix does not create staging rows.
- This fix does not modify `daily_prices`.
- This fix does not fetch or ingest raw market data.
- This fix does not probe an external endpoint.
- This fix does not print secrets.
- This fix does not print row payloads.
- This fix does not print stock_id payloads.
- This fix does not commit raw market data.
- This fix does not approve source rights.
- This fix does not approve a parser.
- This fix does not approve ingestion.
- This fix does not award row coverage points.
- This fix does not promote `publicDataSource=supabase`.
- This fix does not set `scoreSource=real`.
- This fix does not promote CP3 readiness.
- This fix does not approve public coverage claims.

## CEO/PM Decision

```text
READY_FOR_TWII_PARSER_DESIGN_PREPARATION_LOCAL_ONLY
```

CEO recommendation: after local checks pass, move to TWII parser-design preparation using the previously recorded sanitized aggregate evidence. Do not rerun the TWII probe without a new one-attempt execution decision gate.
