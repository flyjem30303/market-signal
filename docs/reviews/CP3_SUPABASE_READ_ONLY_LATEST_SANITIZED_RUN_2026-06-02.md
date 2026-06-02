# CP3 Supabase Read-Only Latest Sanitized Run

Date: 2026-06-02

Status: `CP3 Supabase read-only latest sanitized run recorded`

Decision: `ACCEPT_BLOCKED_READ_ONLY_ATTEMPT_AS_LATEST_SANITIZED_EVIDENCE`

## Scope

This record captures the sanitized result of one process-scoped Supabase read-only validator attempt run on 2026-06-02. It records only status categories and expected object names. It does not record secrets, key prefixes, key suffixes, key lengths, row payloads, row counts, raw validator output, or raw market data.

This update records the CEO-approved bounded readonly attempt from the current session. The validator returned sanitized `blocked` status for the expected object reachability path, with all mutation, SQL, row payload, secret, public-claim, source-depth, and score-source promotion flags remaining `false`.

## Execution Summary

- Execution count: one guarded read-only attempt.
- Command path: `npm run db:readonly-validate` with process-scoped confirmation.
- Exit code: `1`.
- Validator status: `blocked`.
- Validator reason: `read_only_validation_blocked`.
- Connection status: `blocked`.
- Required environment variables: present, values not recorded.
- Files written: `false`.
- Mutations: `false`.
- SQL executed: `false`.
- RPC called: `false`.
- Secrets printed: `false`.
- Row payloads printed: `false`.
- Public claims changed: `false`.
- `scoreSource=real` changed: `false`.
- Source-depth ready changed: `false`.

## Object Reachability Evidence

The validator reported blocked object reachability for:

- `daily_prices`
- `twse_stock_day_staging`
- `market_assets`
- `model_runs`
- `data_freshness`

This is blocked object-reachability evidence only. It is not evidence of schema sufficiency, row freshness, data completeness, data quality, model credibility, production source-depth readiness, public claim readiness, or `scoreSource=real` readiness.

## Still Blocked

- Public data source remains mock.
- `scoreSource=real` remains blocked.
- CP3 readiness remains `not_ready`.
- Source-depth production gate remains blocked.
- SQL execution remains blocked.
- Migration execution remains blocked.
- Supabase writes remain blocked.
- Insert, update, upsert, delete, RPC, and storage writes remain blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit remain blocked.
- Public market-data claims remain blocked.
- Additional remote attempts require a new explicit gate.

## CEO Synthesis

Supabase object reachability is currently blocked for the expected objects in the latest 2026-06-02 bounded attempt. The next high-value work should shift from more governance to root-cause isolation: confirm whether the block is credential scope, table/RLS policy, object existence, project URL, or environment loading, while runtime wiring still keeps public data source as mock and keeps `scoreSource=real` blocked.

## Verification Expectations

- Latest sanitized run checker passes.
- Supabase readonly validator output contract checker passes.
- Post-readonly evidence action gate passes.
- Review gates pass.
- TypeScript check passes.
- Localhost health check passes after dev recovery when needed.
