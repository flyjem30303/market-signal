# TW Equity Daily Prices Insert-Missing Skip-Existing Merge Authorization Packet

Status: `tw_equity_daily_prices_insert_missing_skip_existing_merge_authorization_ready_not_executed`

Date: 2026-06-07

## CEO Decision

The bounded readonly overlap classification proved the `3` existing `daily_prices` target rows are idempotent-safe:

- candidate rows: `180`;
- existing overlap rows: `3`;
- exact value match rows: `3`;
- conflicting overlap rows: `0`;
- missing insert candidate rows: `177`;
- overlap ratio: `0.0167`;
- classification: `idempotent_safe_partial_overlap_skip_existing_insert_missing`.

CEO authorizes PM to prepare the next merge implementation path using an `insert_missing_skip_existing_no_overwrite` policy.

This packet does not execute the production merge. It does not run SQL, write Supabase, modify `daily_prices`, award row coverage points, promote public data source, or set `scoreSource=real`.

## Accepted Evidence

- Merge design packet: `tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed`.
- Remote preflight result: `remote_preflight_blocked_existing_daily_prices_target_rows`.
- Existing target overlap policy: `tw_equity_daily_prices_existing_target_overlap_policy_ready_not_executed`.
- Overlap classification result: `tw_equity_daily_prices_overlap_classification_executed_idempotent_safe_partial_overlap`.
- Post-run review: `docs/reviews/TW_EQUITY_DAILY_PRICES_OVERLAP_CLASSIFICATION_POST_RUN_REVIEW_2026-06-07.md`.

## Merge Policy

Policy id: `insert_missing_skip_existing_no_overwrite`.

Rules:

- Insert only candidate rows whose production key does not yet exist.
- Skip existing production keys when the existing production row exactly matches the accepted candidate values.
- Block if any existing production key differs from the accepted candidate values.
- Block if stock mapping count is not `3`.
- Block if staging/candidate row count is not `180`.
- Block if missing insert candidate count is not `177`.
- Block if existing overlap count is not `3`.
- Block if conflicting overlap count is not `0`.
- Never update, overwrite, upsert, or delete production rows in this policy.

## Expected Write Shape For Later Runner

The future bounded merge runner may prepare `daily_prices` insert rows from the accepted `AUTH-003` candidate:

- `stock_id`: resolved from `stocks.id`, never printed;
- `trade_date`: from `staging_twse_stock_day_prices.trade_date`;
- `open`: from `open_price`;
- `high`: from `high_price`;
- `low`: from `low_price`;
- `close`: from `close_price`;
- `volume`: from `volume`;
- `turnover`: from `trade_value`.

The future runner must not print row payloads, stock ids, secrets, raw market payloads, source payloads, or SQL text.

## Expected Post-Write Readback

If a later separately authorized bounded merge execution succeeds, it must immediately run aggregate readback:

- expected inserted rows: `177`;
- expected skipped existing rows: `3`;
- expected final target rows for the accepted 3-symbol x 60-session scope: `180`;
- expected conflicting rows after merge: `0`;
- expected row coverage numerator increase for this packet: `177`;
- row coverage points remain blocked until a separate row coverage scoring gate accepts production readback.

## Rollback Boundary

Rollback planning must be non-destructive by default:

- No delete is authorized by this packet.
- If rollback is needed after a future write, CEO must create a separate rollback decision packet.
- Any rollback packet must identify only rows inserted by the bounded merge attempt and must not touch the 3 pre-existing exact-match rows.

## Promotion Boundary

Still blocked after this packet:

- production merge execution;
- SQL execution;
- direct Supabase dashboard edits;
- `daily_prices` update/upsert/delete;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claims.

## Next Slice

Create a fail-closed insert-missing/skip-existing merge runner implementation. The runner may include local mock write-path verification, but real Supabase write execution remains separate and must require a new exact authorization id, confirmation value, post-run review path, and immediate aggregate readback.
