# Supabase Bootstrap Validation

Date: 2026-05-29

Project:

```text
taiwan-market-signal
```

## Validation Commands

```bash
npm run db:validate
npm run db:freshness
npm run db:raw-market
```

## Result

```text
PASS
```

## Row Counts

| Table | Count |
|---|---:|
| `market_exchanges` | 4 |
| `stocks` | 1086 |
| `daily_prices` | 1083 |
| `daily_fundamentals` | 1077 |
| `data_runs` | 4 |

## Freshness

| Field | Value |
|---|---|
| State | `complete` |
| Source | `TWSE OpenAPI` |
| Market | `TWSE` |
| Currency | `TWD` |
| Timezone | `Asia/Taipei` |
| As of date | `2026-05-27` |

## Raw Market Smoke Test

Target:

```text
TW / TWSE / 2330
```

Result:

```text
PASS
```

Snapshot:

| Field | Value |
|---|---|
| Symbol | `2330` |
| Name | `台積電` |
| Trade date | `2026-05-27` |
| Close | `2300` |
| Volume | `40272350` |
| PE | `30.92` |
| PB | `10.12` |
| Dividend yield | `0.96` |

## CEO Note

Supabase bootstrap is validated. This does not approve switching public UI data
source to Supabase.

Keep:

```text
NEXT_PUBLIC_DATA_SOURCE=mock
DATA_FRESHNESS_SOURCE=mock
```

Next checkpoint should decide whether to enable Supabase freshness in internal
or public surfaces.
