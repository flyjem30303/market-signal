# CP3 Supabase Read-Only Latest Sanitized Run

Date: 2026-06-03

Status: `CP3 Supabase read-only latest sanitized run recorded`

Decision: `ACCEPT_READ_ONLY_OBJECT_REACHABILITY_AS_BACKEND_EVIDENCE_ONLY`

## Scope

This record captures the sanitized result of one process-scoped Supabase read-only validator attempt run on 2026-06-03 after CEO approval. It records only status categories and expected object names. It does not record secrets, key prefixes, key suffixes, key lengths, row payloads, row counts, raw validator output, or raw market data.

This update records the bounded readonly attempt from the current session. The validator returned sanitized `ok` status for expected object reachability, with all mutation, SQL, row payload, secret, public-claim, source-depth, and score-source promotion flags remaining `false`.

## Execution Summary

- Execution count: one guarded read-only attempt.
- Command path: `npm run db:readonly-validate` with process-scoped confirmation.
- Exit code: `0`.
- Validator status: `ok`.
- Validator reason: `read_only_validation_ok`.
- Connection status: `ok`.
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

The validator reported sanitized read-only object reachability as `ok` for:

- `daily_prices`: reachable `ok`, count status `ok`.
- `twse_stock_day_staging`: reachable `ok`, count status `ok`.
- `market_assets`: reachable `ok`, count status `ok`.
- `model_runs`: reachable `ok`, count status `ok`.
- `data_freshness`: reachable `ok`, count status `ok`.

This is object-reachability evidence only. It is not evidence of schema sufficiency, row freshness, data completeness, data quality, model credibility, production source-depth readiness, public claim readiness, or `scoreSource=real` readiness.

## Still Blocked

- Public data source remains mock.
- `scoreSource=real` remains blocked.
- CP3 readiness remains `not_ready` for public real-score promotion.
- Source-depth production gate remains blocked.
- SQL execution remains blocked.
- Migration execution remains blocked.
- Supabase writes remain blocked.
- Insert, update, upsert, delete, RPC, and storage writes remain blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit remain blocked.
- Public market-data claims remain blocked.
- Additional remote attempts require a new explicit gate.

## CEO Synthesis

Supabase object reachability is now verified for the expected objects in the latest 2026-06-03 bounded attempt. This resolves the previous object-reachability blocker but does not approve runtime promotion. The next useful slice should stay bounded: use this accepted backend evidence to update readonly runtime interpretation and decide the next gate for schema shape, data freshness, row coverage, data quality, and source-depth evidence. Runtime wiring still keeps public data source as mock and keeps `scoreSource=real` blocked.

## Verification Expectations

- Latest sanitized run checker passes.
- Supabase readonly runtime readiness summary checker passes.
- Supabase readonly validator output contract checker passes.
- Post-readonly runtime state checker passes.
- Review gates pass.
- TypeScript check passes.
- Localhost health check passes after dev recovery when needed.
