# Phase 1 Data Online Bounded Readonly Runner Boundary

Status: `phase_1_data_online_bounded_readonly_runner_boundary_ready`

Mode: `bounded_readonly_runner_boundary`

This slice upgrades the named Phase 1 data-online readonly runner from a fail-closed stub to a real-readonly boundary dry-run. It is still not the remote Supabase readonly execution itself.

## CEO Decision

- Implement the exact runner boundary for `attemptId=phase1-data-online-readonly-20260615-a`.
- Keep the boundary in `real_readonly_boundary_dry_run` mode unless a later execution slice explicitly requests the one bounded remote readonly attempt.
- Use only sanitized environment-presence output for `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
- Keep all public runtime state at `publicDataSource=mock` and `scoreSource=mock`.

## Runner Results Accepted By Post-Run Review

- `phase_1_data_online_bounded_readonly_boundary_blocked_missing_env`
- `phase_1_data_online_bounded_readonly_boundary_dry_run_ready`

Both accepted outcomes preserve:

- `remoteAttempted=false`
- `executionAuthorizedNow=false`
- `readonlyAttemptExecutableNow=false`
- aggregate-only scope
- no row payload output
- no secret output

## Commands

Runner:

`cmd.exe /c npm run run:phase-1-data-online-bounded-readonly-attempt-once -- --attempt-id phase1-data-online-readonly-20260615-a --scope aggregate-readonly-daily-prices-level1-coverage --aggregate-only --confirm CEO_APPROVED_PHASE1_DATA_ONLINE_READONLY_ONCE --real-readonly-boundary true`

Post-run review:

`cmd.exe /c npm run report:phase-1-data-online-bounded-readonly-post-run-review -- --summary-path tmp/phase-1-data-online-readonly-boundary-phase1-data-online-readonly-20260615-a.json`

Checker:

`cmd.exe /c npm run check:phase-1-data-online-bounded-readonly-runner-boundary`

## Boundary

No SQL, No Supabase write, No staging rows, No `daily_prices` mutation, No market-row fetch, No raw payload output, No secret output, No source promotion, No score promotion, No public real-data claim, and No investment advice.

This boundary slice may classify whether the local environment has the required Supabase variable names. It must not print values, tokens, connection strings, service-role keys, raw market rows, endpoint response bodies, or individual price rows.

## Next Route

If the boundary output is `phase_1_data_online_bounded_readonly_boundary_blocked_missing_env`, PM should repair local/hosting env naming before the single remote readonly attempt. If the boundary output is `phase_1_data_online_bounded_readonly_boundary_dry_run_ready`, PM may prepare the exact one aggregate readonly attempt and immediate post-run review packet.
