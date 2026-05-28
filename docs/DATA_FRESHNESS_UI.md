# Data Freshness UI Requirements

## Purpose

Before the UI can use real Supabase data, users must be able to understand:

- What data source is being shown.
- What date the data represents.
- Whether the data is complete or partial.
- Whether scores are real, mock, or unavailable.
- Which market, currency, and timezone apply.

This document defines the minimum UI requirements for data freshness and source
attribution.

## CEO Decision

The product may connect to Supabase for validation, but the public UI must not
show real market data without freshness context.

The goal is trust. A clean interface that hides data uncertainty is not
acceptable for a financial tool.

## Required UI Surface

Each market-aware page should eventually include a compact freshness strip near
the top of the page or near the main data block.

Recommended content:

```text
資料來源：TWSE OpenAPI
資料日期：2026-05-27
市場：TWSE
幣別：TWD
時區：Asia/Taipei
資料狀態：完整 / 部分 / 延遲
分數來源：模擬評分 / 正式評分 / 混合評分
```

For mock data, the UI must say:

```text
目前為模擬資料
```

## Status Labels

Use these user-facing labels:

```text
完整
部分
延遲
模擬
不可用
```

Internal mapping:

| Internal state | UI label | Meaning |
|---|---|---|
| complete | 完整 | Expected data exists and is fresh enough |
| partial | 部分 | Some expected data is missing |
| stale | 延遲 | Data exists but is older than expected |
| mock | 模擬 | Data is synthetic or local mock |
| unavailable | 不可用 | Required data cannot be loaded |

## Placement

### Daily Briefing

Place freshness near the market summary header.

It should answer:

- Which market is this briefing about?
- What is the latest market data date?
- Is the signal based on real or mock data?

### Stock Page

Place freshness near the quote summary and score area.

It should answer:

- Which exchange and currency apply?
- What is the latest price date?
- What is the latest valuation date?
- Are scores real or mock?

### Weekly Page

Place freshness near the article metadata.

It should answer:

- Which data range is covered?
- Which sources were used?
- Is the article manually written, generated, or mixed?

## Design Requirements

F / UIUX guidance:

- Keep the strip compact.
- Do not use a large warning box unless data is unavailable or dangerously stale.
- Use neutral styling for normal freshness.
- Use stronger visual treatment only for stale, partial, or mock status.
- Do not place the freshness strip inside score cards.
- Do not make the strip look like an advertisement or CTA.
- Keep a lightweight score-source note near interpreted score cards while
  scores remain mock or mixed.

## Legal Requirements

D / Legal guidance:

- If real market data and model interpretation appear together, the page must
  include or link to investment disclaimer language.
- If data is delayed, stale, partial, or simulated, this must be visible before
  users act on the interpretation.
- Commercial placements must not visually attach to freshness labels or score
  labels.

## Investment Credibility Requirements

C / Investment guidance:

- Real scores cannot be shown until each score has a model version and data
  quality status.
- If a score uses partial data, the UI must not present it as equally reliable.
- Historical backtest claims require sample period and assumptions.

## Data Requirements

A / Engineering requirements:

The UI should derive freshness from:

- `data_runs`
- latest `daily_prices.trade_date`
- latest `daily_fundamentals.trade_date`
- future `daily_scores.last_updated_at`
- `market_exchanges`

Do not hard-code freshness dates in React components.

## Minimum Before Supabase UI Switch

Before `NEXT_PUBLIC_DATA_SOURCE=supabase` can be used:

1. Add a data freshness read model or helper.
2. Add freshness display to briefing and stock pages.
3. Ensure mock mode still displays "模擬資料".
4. Ensure Supabase mode can display source and latest data date.
5. Add legal disclaimer link near interpreted score areas.
6. Keep score source visible while freshness metadata and model scoring mature at
   different speeds.

## Deferred

Do not implement these until after real repository read path exists:

- User-customized freshness alerts.
- Email warnings.
- Multi-market freshness dashboard.
- Paid data quality tiers.
