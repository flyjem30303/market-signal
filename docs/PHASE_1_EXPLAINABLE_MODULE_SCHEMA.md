# Phase 1 Explainable Module Schema

## Goal

Phase 1 stock pages must explain why a score looks the way it does. The page should not translate a score into generic prose. Each displayed positive or negative factor must trace back to an explicit rule and source field.

## Runtime Module Shape

Each module should include:

- `id`: stable module key.
- `name`: Chinese display label. `label` is optional compatibility metadata.
- `health`: 0-100 health score.
- `risk`: 0-100 risk score.
- `weight`: relative module impact for explanation ranking.
- `note`: short human-readable reason for the module.
- `evidence`: one or more `{ ruleId, source, value }` records.
- `updatedAt`: source update time.
- `source`: source family, for example `TWSE OpenAPI + daily_scores`.

`dataQuality` and `dataFreshness` are confidence inputs. They must not appear as market positives or negatives.

## Phase 1 Mapping

| Module | Status | Sources | Explanation use |
| --- | --- | --- | --- |
| `trend` | active | `daily_scores.composite_score`, `daily_scores.health_score`, `daily_scores.risk_score` | Market positive/negative factor |
| `momentum` | active when OHLC exists | `daily_prices.open`, `daily_prices.close`, `computed.open_close_return_pct` | Market positive/negative factor |
| `volatility` | active when OHLC exists | `daily_prices.high`, `daily_prices.low`, `daily_prices.close`, `computed.intraday_range_pct` | Market positive/negative factor |
| `dataFreshness` | active | `daily_scores.trade_date`, `daily_scores.stale_data_flags.length` | Confidence only |
| `valuation` | missing in Phase 1 | none yet | Flagged as `valuation_source_missing_phase_1` |
| `fundFlow` | missing in Phase 1 | no comparable baseline yet | Flagged as `fund_flow_baseline_missing_phase_1` |

## Missing And Stale Rules

- If `open` or `close` is missing, add `momentum_price_fields_missing_phase_1`.
- If `high`, `low`, or `close` is missing, add `volatility_price_fields_missing_phase_1`.
- Until a valuation source is approved, add `valuation_source_missing_phase_1`.
- Until a comparable turnover or volume baseline exists, add `fund_flow_baseline_missing_phase_1`.
- Existing source flags such as `news_score_not_included_phase_1` remain confidence context, not market cause text.

## Frontend Contract

- When market modules exist, `positives` and `negatives` must each contain at least one item.
- Each explanation item must include evidence with `ruleId`, `source`, and `value`.
- Quality or freshness reasons must only appear under confidence, not under score-source positives or negatives.
- If modules are empty, the page must fail safe with an honest limited-explanation state.
