# TW Equity Daily Prices Existing Target Overlap Policy

Status: `tw_equity_daily_prices_existing_target_overlap_policy_ready_not_executed`

Date: 2026-06-07

## Why This Exists

The first bounded Supabase readonly preflight for `AUTH-003` was attempted and rejected safely.

Sanitized aggregate evidence:

- `staging_run_count`: observed `1`, expected `1`, status `ok`.
- `staging_price_count`: observed `180`, expected `180`, status `ok`.
- `distinct_symbol_count`: observed `3`, expected `3`, status `ok`.
- `stock_mapping_count`: observed `3`, expected `3`, status `ok`.
- `unmapped_symbol_count`: observed `0`, expected `0`, status `ok`.
- `duplicate_staging_key_count`: observed `0`, expected `0`, status `ok`.
- `duplicate_production_key_count`: observed `0`, expected `0`, status `ok`.
- `existing_daily_prices_target_count`: observed `3`, expected `0`, status `mismatch`.

The blocked result means staging evidence is strong enough to continue analysis, but production merge remains blocked until the existing production overlap is classified.

## CEO Decision

Do not repeat the same zero-overlap remote preflight.

The next safe data slice is an overlap-classification gate that answers whether the 3 existing `daily_prices` target rows are:

- legitimate already-promoted production rows that should be skipped by an idempotent merge;
- test or residue rows that require chairman/operator cleanup outside Codex before merge;
- conflicting rows that require a separate reconciliation design before any production mutation.

## Policy

- Existing production overlap is not an automatic approval for merge.
- Existing production overlap is not an automatic reason to delete rows.
- A future merge runner must be idempotent and must report inserted/skipped/conflicted aggregate counts.
- A future overlap classifier may read sanitized aggregate evidence only.
- A future overlap classifier must not print stock ids, row payloads, secrets, raw market payloads, source payloads, or SQL text.
- A future merge remains separately authorized and must not be bundled into overlap classification.

## Current Promotion State

- Staging-to-`daily_prices` merge authorized: `false`.
- Production `daily_prices` mutation authorized: `false`.
- Row coverage points awarded: `false`.
- `publicDataSource`: `mock`.
- `scoreSource`: `mock`.

## Next Slice

Create a bounded readonly overlap-classification runner and post-run review template.

The runner should classify only sanitized aggregate outcomes:

- total existing target overlap count;
- expected candidate target count;
- overlap ratio;
- per-expected-symbol aggregate counts, without stock ids or row payloads;
- conflict status if a safe aggregate comparison can be performed without exposing row payloads.

If the classifier cannot prove idempotent-safe overlap, the merge remains blocked.
