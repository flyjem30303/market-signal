# A1 ETF Market Price Source Scope No-Fetch

Updated: 2026-06-13

Status: `a1_etf_market_price_source_scope_no_fetch_ready`

Owner: A1 Data / Source / Coverage support lane

Scope: `etf_market_price_source_scope_without_market_row_fetch`

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## 1. Purpose

This packet narrows the ETF lane to a market-price-only scope before any future real-data promotion can be discussed.

The current public Beta may show ETF pages and ETF context as mock decision-support examples. It must not imply that ETF real data, ETF full coverage, ETF NAV, ETF holdings, or ETF product advice are already available.

This packet is planning-only. It does not contain ETF rows, market prices, NAV values, holdings, premium-discount values, source payloads, API keys, candidate rows, or Supabase records.

## 2. Target Instruments

Initial public Beta ETF context remains limited to:

- `0050`
- `006208`

These are mock runtime anchors only. They are not proof of complete ETF coverage and do not authorize ETF row coverage points.

## 3. In Scope For Future Market-Price Display

Future ETF real display may only consider exchange-traded market-price fields:

| Field group | Planning fields | Current status | Public meaning |
| --- | --- | --- | --- |
| Instrument identity | `symbol`, `displayName`, `assetClass`, `exchange`, `currency` | `checking` | Identifies the ETF as an exchange-traded instrument, not a fund recommendation. |
| Session price | `sessionDate`, `closePrice`, `priceChange`, `changePercent` | `checking` | Shows delayed daily market-price movement after source and rights gates pass. |
| Trading activity | `volume`, `turnover` | `checking` | Shows liquidity context only; it is not a buy/sell signal. |
| Source metadata | `sourceName`, `sourceUrlLabel`, `sourceUpdatedAt`, `sourceCadence` | `checking` | Explains where the market-price data came from and when it was updated. |
| Quality controls | `missingSessionPolicy`, `revisionPolicy`, `duplicateDatePolicy`, `failClosedPolicy` | `checking` | Keeps the runtime from filling gaps with unsupported assumptions. |

## 4. Explicitly Out Of Scope

These ETF data types are excluded from the market-price lane:

| Excluded data type | Reason |
| --- | --- |
| NAV | Requires a separate fund-data source, cadence, attribution, and public interpretation policy. |
| Holdings / constituents | Requires issuer or fund disclosure terms, membership revision rules, and redistribution review. |
| Premium / discount | Requires NAV plus market price and a separate formula/threshold contract. |
| Intraday iNAV | Not needed for this public Beta and could imply real-time precision. |
| Distribution / dividend schedules | Requires issuer disclosure terms and separate investor-warning copy. |
| Fund factsheet text | Issuer-owned product material; do not reuse as public content without a separate rights review. |
| ETF recommendation ranking | Would drift into product advice; keep the site educational and non-advisory. |

## 5. Source-Rights Posture

Current status:

- ETF source-rights status: `checking`
- ETF redistribution status: `not_approved`
- ETF market-price field contract: `draft_only`
- ETF row coverage credit: `blocked`
- ETF runtime posture: `mock_only`

PM may say:

- `ETF 市價來源範圍仍在確認中`
- `0050 與 006208 目前只是 mock 觀察範例`
- `ETF 市價、NAV、成分股與折溢價資料會分開處理`
- `ETF 區塊不提供買賣建議`

PM must not say:

- `ETF 真實資料已上線`
- `ETF 覆蓋已完整`
- `ETF NAV 已接入`
- `ETF 成分股已接入`
- `ETF 折溢價已接入`
- `建議買進 ETF`
- `建議賣出 ETF`

## 6. PM Runtime Intake

Recommended PM intake decision:

`accept_a1_etf_market_price_source_scope_no_fetch`

Meaning:

PM may convert this scope into public runtime readiness labels. PM may not use this packet to claim real ETF data, ETF full coverage, NAV support, holdings support, premium-discount support, source approval, or investment advice.

Recommended next PM route:

`wire_etf_market_price_scope_into_public_runtime_labels`

Recommended next A1 route:

`prepare_etf_market_price_field_contract_no_fetch`

Recommended next A2 route:

`review_etf_market_price_scope_public_copy_safety`

## 7. Hard Boundaries

This artifact does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- ETF market-row fetch, ingestion, storage, output, or commit;
- ETF raw payload output;
- ETF endpoint output;
- ETF candidate row acceptance;
- ETF row coverage points;
- NAV display;
- holdings display;
- premium-discount display;
- secret output;
- source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## 8. Completion Evidence

This artifact is complete when a checker proves:

1. target instruments `0050` and `006208` are present;
2. market-price scope is separated from NAV, holdings, premium-discount, intraday iNAV, distribution schedules, and factsheet content;
3. source-rights posture remains `checking` / `not_approved`;
4. runtime remains `publicDataSource=mock` and `scoreSource=mock`;
5. PM/A1/A2 next routes are named;
6. the artifact is registered in `package.json` and `scripts/check-review-gates.mjs`.
