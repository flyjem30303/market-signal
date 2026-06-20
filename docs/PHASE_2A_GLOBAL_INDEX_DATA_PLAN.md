# Phase 2A Global Index Data Plan

Status: `phase_2a_global_index_data_plan_ready_report_only`

Date: 2026-06-20

Owner: A2 Phase 2A global index data lane

## Executive Recommendation

Phase 2A should begin with a metadata and source-rights slice, not live ingestion.

The strongest first candidates are US reference indices plus Nikkei 225 because they have a clean candidate route through FRED. However, FRED is still `conditional` for our intended use because third-party index rights, storage, attribution, and public redistribution must be cleared before DB persistence or public display.

Recommended first batch:

| priority | index | proposed symbol | market role | source status |
|---:|---|---:|---|---|
| 1 | S&P 500 | SP500 | US broad market reference | conditional |
| 2 | NASDAQ Composite | NASDAQCOM | US growth/tech reference | conditional |
| 3 | Dow Jones Industrial Average | DJIA | US blue-chip reference | conditional |
| 4 | Nikkei 225 | NIKKEI225 | Japan regional reference | conditional |

Do not include HSI, STOXX 600, DAX, SSE Composite, CSI 300, or KOSPI in the first executable ingestion batch until source rights are resolved.

## Candidate Universe

| region | index | proposed symbol | displayName | country | exchange / market | updateFrequency | legalUsageStatus |
|---|---|---:|---|---|---|---|---|
| US | S&P 500 | SP500 | S&P 500 | US | INDEX_US | daily after close | conditional |
| US | NASDAQ Composite | NASDAQCOM | NASDAQ Composite | US | INDEX_US | daily after close | conditional |
| US | Dow Jones Industrial Average | DJIA | Dow Jones Industrial Average | US | INDEX_US | daily after close | conditional |
| Japan | Nikkei 225 | NIKKEI225 | Nikkei 225 | JP | INDEX_JP | daily after close | conditional |
| Korea | KOSPI | KOSPI | KOSPI | KR | INDEX_KR | daily after close | unresolved |
| Hong Kong | Hang Seng Index | HSI | Hang Seng Index | HK | INDEX_HK | daily after close | rejected for free path |
| Europe | STOXX Europe 600 | SXXP | STOXX Europe 600 | EU | INDEX_EU | daily after close | rejected for free path |
| Germany | DAX | DAX | DAX | DE | INDEX_DE | daily after close | rejected for free path |
| China | SSE Composite | SSECOMP | SSE Composite Index | CN | INDEX_CN | daily after close | unresolved |
| China | CSI 300 | CSI300 | CSI 300 | CN | INDEX_CN | daily after close | unresolved |

## Minimum Data Contract

Required fields for Phase 2A source planning:

| field | type | note |
|---|---|---|
| symbol | text | Global-safe canonical index symbol used by our app. |
| displayName | text | User-facing index name. |
| country | text | ISO-like country/region code such as US, JP, KR, HK, EU, DE, CN. |
| exchange / market | text | Market grouping; use index-specific market labels instead of pretending these are equities exchanges. |
| close | numeric | Closing index value. Do not store until source rights are accepted. |
| change | numeric | Close minus previous close. Can be derived only if close storage/derivation is approved. |
| changePercent | numeric | change / previous close. Can be derived only if close storage/derivation is approved. |
| tradeDate | date | Source trading date in source market timezone. |
| source | text | Source name such as FRED or licensed vendor. |
| sourceUrl | text | Source evidence URL or source series URL. |
| updateFrequency | text | Expected cadence, usually daily after close. |
| legalUsageStatus | text | accepted / conditional / rejected / unresolved. |

## Schema Recommendation

Use separate global index tables first. Do not overload `stocks`, `daily_prices`, and `daily_scores` for Phase 2A until the global market model is accepted.

Recommended planning schema:

```text
global_indices
global_index_prices
global_index_scores
```

### global_indices

| column | type | note |
|---|---|---|
| id | uuid | Primary key. |
| symbol | text | Canonical index symbol. |
| display_name | text | User-facing name. |
| country | text | Country/region code. |
| market | text | INDEX_US, INDEX_JP, INDEX_KR, INDEX_HK, INDEX_EU, INDEX_DE, INDEX_CN. |
| currency | text | Usually POINT for index value; keep separate from cash currency. |
| timezone | text | Source market timezone. |
| source_name | text | Candidate or accepted source. |
| source_url | text | Source evidence URL. |
| update_frequency | text | Daily after close. |
| legal_usage_status | text | accepted / conditional / rejected / unresolved. |
| is_active | boolean | True only after PM approves inclusion. |
| created_at | timestamp | Metadata creation time. |
| updated_at | timestamp | Metadata update time. |

Unique key:

```text
unique(country, market, symbol)
```

### global_index_prices

| column | type | note |
|---|---|---|
| global_index_id | uuid | References global_indices.id. |
| trade_date | date | Trading date. |
| close | numeric | Closing value. |
| change | numeric | Derived or source-provided daily point change. |
| change_percent | numeric | Derived or source-provided daily percent change. |
| source_name | text | Exact source for this row. |
| source_url | text | Exact source URL or series URL. |
| source_observed_at | timestamp | When source was checked. |
| legal_usage_status | text | Row-level source status at ingestion time. |
| ingestion_run_id | uuid | Optional reference to data_runs. |

Unique key:

```text
unique(global_index_id, trade_date)
```

### global_index_scores

| column | type | note |
|---|---|---|
| global_index_id | uuid | References global_indices.id. |
| trade_date | date | Score date. |
| health_score | integer | 0-100. |
| risk_score | integer | 0-100. |
| composite_score | integer | 0-100. |
| data_quality_score | integer | 0-100. |
| data_quality_grade | text | A / B / C / D. |
| stale_data_flags | text[] | Freshness warnings. |
| missing_module_flags | text[] | Missing module warnings. |
| signal | text | green / yellow / orange / red / deep-red. |
| model_version | text | Must be global-index-specific. |
| last_updated_at | timestamp | Score update time. |

## Why Not Reuse stocks / daily_prices Immediately

The existing `stocks` table already has global-ready fields such as country, exchange, currency, timezone, and asset_type. Still, global indices have different legal, scoring, and field semantics:

- Index values are points, not share prices.
- Many indices do not have volume/turnover in the same sense as stocks.
- Index rights are often stricter than equity end-of-day data.
- Score modules should not imply stock-specific fundamentals or flows apply to indices.
- A separate table keeps Phase 2A from accidentally changing `/stocks/[symbol]` behavior.

Longer-term option:

After source rights and scoring are stable, PM can decide whether to merge `global_indices` into a generalized `assets` model. That should be a separate architecture decision.

## Scoring Engine Assessment

| component | reuse decision | note |
|---|---|---|
| compositeScore | partially reusable | The 0-100 output scale and signal thresholds can be reused, but formula inputs must change for global indices. |
| riskScore | partially reusable | The scale is reusable. Inputs should use volatility, drawdown, trend break, freshness, and cross-market stress, not stock beta/valuation assumptions. |
| healthScore | partially reusable | The concept is reusable. Modules need global-index versions. |
| modules | needs international index version | Current module labels include valuation, breadth, flow, macro. For index-only close data, Phase 2A V1 should start with trend, volatility, momentum, drawdown, freshness, and source-quality. |
| confidence / freshness | reusable | Existing freshness and quality flags are a strong fit. Use market timezone and trading calendar per index. |
| model_version | must fork | Use `global-index-v0.1-source-review` for planning and `global-index-price-only-v0.1` only after data rights are accepted. |

Recommended Phase 2A V1 modules:

| module_key | purpose | required data |
|---|---|---|
| trend | Moving-average and price-position signal. | Close series. |
| momentum | Short/medium return direction. | Close series. |
| volatility | Recent volatility and instability. | Close series. |
| drawdown | Distance from recent high. | Close series. |
| freshness | Whether latest trading session is current for that market. | tradeDate, market calendar. |
| source_quality | Legal/source confidence and row completeness. | source metadata. |

Do not use stock-specific valuation, earnings, margin, or institutional-flow modules for global index V1.

## First Engineering Slice

Recommended first slice: `phase_2a_global_index_source_registry_report_only`

Scope:

1. Add metadata-only candidate registry in docs.
2. Add source review with legal status per index.
3. Add report-only checker that fails closed if docs imply ingestion, Supabase writes, raw payloads, or source promotion.
4. Prepare a bounded fetch/write packet template for PM review, but do not execute it.

Acceptance criteria:

- Candidate list covers US, JP, KR, HK, Europe, and China.
- Each candidate has source, sourceUrl, updateFrequency, and legalUsageStatus.
- No index is marked `accepted` unless usage rights are explicit.
- First implementation path remains report-only.
- `publicDataSource=mock` and `scoreSource=mock` remain unchanged.

## Bounded Future Packet Shape

Future packet is allowed only after CEO/PM approval:

```text
packetName: phase_2a_global_index_bounded_fetch_candidate
allowedSymbols: [SP500, NASDAQCOM, DJIA, NIKKEI225]
allowedFields: [symbol, close, tradeDate, source, sourceUrl]
derivedFields: [change, changePercent]
maxRowsPerSymbol: 2
writeEnabled: false by default
requiresLegalUsageStatus: accepted
requiresSourceAttribution: true
requiresNoSecretsInOutput: true
```

This packet must remain disabled while sources are `conditional`.

## Risks

| risk | impact | mitigation |
|---|---|---|
| Treating FRED as full redistribution permission | Legal and product risk. | Keep FRED conditional until rights owner and storage/display terms are approved. |
| Using website scraping for HKEX/STOXX/SSE | Terms violation risk. | Reject scrape routes and require license/vendor. |
| Reusing stock scoring modules for indices | Misleading signals. | Use global-index modules based on close series, volatility, drawdown, freshness, and source quality. |
| Symbol collision | Wrong asset mapping. | Use country + market + symbol unique key. |
| Timezone/calendar mismatch | False stale-data flags. | Store source timezone and market calendar policy per index. |
| Public copy overclaim | User trust/legal risk. | Keep source/status labels internal until PM approves user-facing copy. |

## CEO/PM Authorization Needed

CEO/PM should decide:

1. Whether Phase 2A first public scope is metadata-only, delayed reference display, or full stored daily index prices.
2. Whether FRED conditional sources may be used after attribution and no-storage constraints, or require explicit source-owner permission.
3. Whether to license a vendor for Hong Kong, Europe, and China indices.
4. Whether KOSPI should be pursued through KRX official API review or deferred.
5. Whether global index V1 scores may launch as price-only explainable signals after data rights are accepted.

