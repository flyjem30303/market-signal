# TW Equity Staging To Daily Prices Merge Design Packet

Date: 2026-06-07

Status: `tw_equity_staging_to_daily_prices_merge_design_packet_ready_not_executed`.

## CEO Decision

The accepted `AUTH-003` staging rows may be used to design a future production merge path into `daily_prices`. This packet does not authorize execution. It defines the minimum fail-closed contract for a later bounded merge runner and readback verification.

## Accepted Input Evidence

- Staging write post-run review: `tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion`.
- Post-write staging verification: `tw_equity_post_write_staging_verification_counts_match_no_public_promotion`.
- Promotion readiness gate: `tw_equity_post_write_promotion_readiness_gate_staging_verified_promotion_blocked`.
- Accepted staging run id scope: `AUTH-003` run only.
- Staging run rows: `1`.
- Staging price rows: `180`.
- Symbols: `2330`, `2382`, `2308`.

## Coverage Universe

- Current production coverage target for this merge design: 3 TW equity symbols.
- Symbol set: `2330`, `2382`, `2308`.
- Session policy: 60 trading sessions per symbol from the accepted staging artifact.
- Expected production rows from this staging run: `180`.
- Coverage denominator for this merge packet: `180`.
- This packet does not change the broader MVP row coverage denominator of 6 symbols x 60 sessions.

## Schema Mapping

| Staging source | Production target | Rule |
| --- | --- | --- |
| `staging_twse_stock_day_prices.symbol` | `stocks.symbol` | join with `stocks.country='TW'` and `stocks.exchange='TWSE'` |
| `stocks.id` | `daily_prices.stock_id` | required; missing stock mapping blocks execution |
| `staging_twse_stock_day_prices.trade_date` | `daily_prices.trade_date` | required; part of production primary key |
| `open_price` | `open` | numeric passthrough |
| `high_price` | `high` | numeric passthrough; must be >= low |
| `low_price` | `low` | numeric passthrough |
| `close_price` | `close` | numeric passthrough |
| `volume` | `volume` | numeric passthrough |
| `trade_value` | `turnover` | numeric passthrough |

Production key: `daily_prices(stock_id, trade_date)`.

Staging key: `staging_twse_stock_day_prices(run_id, exchange_code, symbol, trade_date)`.

## Fail-Closed Runner Contract

Any future write-capable merge runner must stop unless all preflight checks pass:

- Exact authorization id is provided in a later execution decision packet.
- Exact accepted staging `run_id` is provided.
- Staging run count equals `1`.
- Staging price count equals `180`.
- Stock mapping count equals `3`.
- Unmapped symbol count equals `0`.
- Duplicate production key count inside staging scope equals `0`.
- Existing `daily_prices` rows for the target key set are counted before mutation.
- Conflict policy is explicitly selected before execution.
- Readback post-run review path is named before execution.
- `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Conflict Policy

Default policy: `insert_only_no_overwrite`.

- If existing target rows for the accepted key set are greater than `0`, the first merge runner must block and report sanitized counts.
- A later overwrite/upsert policy requires a separate CEO decision, rollback plan, and post-run review.
- Rollback must be scoped by the accepted staging `run_id` and target key set. Destructive rollback is not authorized by this packet.

## Future Execution Shape

The future runner may prepare rows shaped as:

```json
{
  "stock_id": "resolved from stocks.id, never printed",
  "trade_date": "YYYY-MM-DD",
  "open": "from open_price",
  "high": "from high_price",
  "low": "from low_price",
  "close": "from close_price",
  "volume": "from volume",
  "turnover": "from trade_value"
}
```

The runner must not print `stock_id` values or row payloads.

## Readback Verification

Any future successful merge must immediately run bounded aggregate readback:

- Count production `daily_prices` rows for the accepted 3-symbol x 60-session target set.
- Expected readback rows: `180`.
- Print only sanitized aggregate counts.
- Do not print `stock_id`, row payloads, raw market payloads, source URL payloads, or secrets.

## Promotion Boundary

This packet does not authorize:

- `daily_prices` mutation;
- SQL execution;
- Supabase insert/update/upsert/delete;
- market-data fetch or ingestion;
- row coverage points;
- public source promotion;
- `scoreSource=real`;
- investment claims based on real production data.

## Next Slice

Create a local fail-closed merge runner skeleton that can perform dry-run/preflight counts only, without mutation, and a checker proving it defaults to blocked until a separate execution decision is accepted.
