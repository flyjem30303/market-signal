# TW Equity Staging Write Implementation

Updated: 2026-06-06

Status: `tw_equity_staging_write_implementation_ready_not_executed`.

## Scope

This slice implements the narrow server-side staging write path permitted by `docs/TW_EQUITY_WRITE_IMPLEMENTATION_FINAL_AUTHORIZATION_ACCEPTANCE.md`.

The write-capable path is limited to `scripts/run-tw-equity-staging-write-once.mjs` and only targets:

- `staging_twse_stock_day_runs`;
- `staging_twse_stock_day_prices`.

## Runtime Guards

The runner remains fail-closed unless all of these are true:

- exact authorization id matches `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`;
- lane is `tw-equity`;
- symbols are exactly `2330,2382,2308`;
- sessions is exactly `60`;
- target relation is exactly `staging_twse_stock_day_runs,staging_twse_stock_day_prices`;
- max rows is exactly `180`;
- post-run review path is exactly `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md`;
- `TW_EQUITY_STAGING_WRITE_CONFIRMATION=CEO_APPROVED_TW_EQUITY_BOUNDED_STAGING_WRITE_ONCE`;
- `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present;
- a sanitized candidate input artifact is accepted;
- rollback dry-run posture is present;
- rollback dry-run remote count for the candidate run scope is empty.

## Safety Boundary

The implementation:

- uses dynamic server-side Supabase client creation inside the runner only;
- does not expose the service role key to client-side code;
- does not print Supabase URL or key material;
- does not print row payloads;
- does not run SQL text;
- does not call update, delete, or upsert;
- does not fetch market data;
- does not write local artifacts;
- does not promote `publicDataSource`;
- does not set `scoreSource=real`;
- does not award row coverage points;
- does not retry;
- does not perform destructive rollback.

## Local Verification Mode

`TW_EQUITY_STAGING_WRITE_MOCK_SUPABASE=enabled` is reserved for local implementation checker coverage. It simulates rollback counts and insert success without connecting to Supabase.

The local checker verifies:

- dry-run/no-execute mode never connects or mutates;
- execute mode without a valid candidate remains blocked without connecting;
- mocked execute mode reaches the insert path without remote connection;
- sanitized stdout contains aggregate status only;
- secrets, row payloads, raw payloads, SQL text, public promotion, row coverage points, and real score source remain blocked.

## Current Stop Line

The implementation is ready for a future bounded staging write attempt, but this slice does not execute a real Supabase write.

No SQL, real Supabase connection, real Supabase write, staging row creation, production `daily_prices` mutation, market-data fetch, market-data ingestion, candidate artifact creation, source payload output, row payload output, secret output, public promotion, row coverage points, or `scoreSource=real` occurred in this implementation slice.
