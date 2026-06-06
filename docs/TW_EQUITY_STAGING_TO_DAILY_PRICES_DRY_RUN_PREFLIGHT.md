# TW Equity Staging To Daily Prices Dry Run Preflight

Date: 2026-06-07

Status: `tw_equity_staging_to_daily_prices_dry_run_preflight_ready_no_remote_attempt`.

## CEO Decision

The accepted `AUTH-003` staging evidence can move from merge design into a local fail-closed dry-run preflight skeleton. This preflight is not a production merge, not a Supabase readonly attempt, and not SQL execution. It only defines and verifies the bounded aggregate checks that a later explicitly authorized remote preflight must perform before any `daily_prices` mutation can be considered.

## Accepted Input Evidence

- Merge design packet: `tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed`.
- Staging write status: `tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion`.
- Post-write staging verification: `tw_equity_post_write_staging_verification_counts_match_no_public_promotion`.
- Promotion readiness gate: `tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked`.
- Accepted staging scope: `AUTH-003` only.
- Expected staging run rows: `1`.
- Expected staging price rows: `180`.
- Expected stock mapping rows: `3`.
- Expected unmapped symbols: `0`.
- Expected duplicate target keys: `0`.
- Current production merge denominator for this packet: `180`.

## Local Runner Contract

The local preflight runner must:

- Exit successfully only as a local readiness report.
- Print sanitized aggregate plans only.
- Keep `connectionAttempted=false`.
- Keep `sqlExecuted=false`.
- Keep `dailyPricesMutated=false`.
- Keep `supabaseWriteAttempted=false`.
- Keep `rowCoveragePointsAwarded=false`.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Never import or instantiate a Supabase client.
- Never print secrets, row payloads, raw market payloads, source payloads, `stock_id` values, or query result rows.

## Future Bounded Remote Preflight Counts

A later explicitly authorized bounded readonly preflight may collect only these sanitized aggregate counts:

| Count name | Expected value | Purpose |
| --- | ---: | --- |
| `staging_run_count` | `1` | Confirms the accepted staging run scope exists exactly once. |
| `staging_price_count` | `180` | Confirms the accepted staging artifact still has the expected row count. |
| `distinct_symbol_count` | `3` | Confirms the staging scope covers only `2330`, `2382`, `2308`. |
| `stock_mapping_count` | `3` | Confirms every staging symbol maps to `stocks`. |
| `unmapped_symbol_count` | `0` | Blocks production merge if any symbol lacks `stocks.id`. |
| `duplicate_staging_key_count` | `0` | Confirms no duplicate staging primary-key shape exists. |
| `duplicate_production_key_count` | `0` | Confirms no duplicate target-key shape would be generated. |
| `existing_daily_prices_target_count` | `0` | Blocks first insert-only merge if target rows already exist. |

The future remote preflight must use sanitized aggregate output only. If any count is missing, non-numeric, unexpected, or inconsistent with the accepted scope, the merge remains blocked.

## Readback Design Dependency

Production readback remains a later post-merge gate. The dry-run preflight can prepare the readback contract but cannot claim production coverage. A future successful merge must immediately read back only:

- production target row count for the accepted 3-symbol x 60-session set;
- symbol aggregate count;
- min/max trade date;
- count status against expected `180`.

## Promotion Boundary

This preflight does not authorize:

- SQL execution;
- Supabase connection;
- Supabase insert/update/upsert/delete;
- `daily_prices` mutation;
- row coverage points;
- public source promotion;
- `scoreSource=real`;
- investment claims based on production data.

## Next Slice

Create the bounded remote preflight authorization packet and post-run review template, or run the local dry-run preflight checker again before asking CEO to authorize a single bounded readonly attempt.
