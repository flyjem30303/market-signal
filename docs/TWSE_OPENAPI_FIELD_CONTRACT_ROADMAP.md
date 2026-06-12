# TWSE OpenAPI Field Contract Roadmap for Consumer-Ready Parsing

## Target and role

- A1 owner: `twse_openapi_runtime_consumer_adapter_synthetic_case_notes`
- Mainline main lane: `prepare_twse_openapi_runtime_mock_consumer_wiring_readiness`
- 運行邊界:
  - synthetic parser fixtures only
  - no endpoint fetch
  - no SQL / Supabase write

Boundary settings:
- `publicDataSource = "mock"`
- `scoreSource = "mock"`
- `rawMarketDataFetch = false`

## Source contract fields (raw route shape)

### 1) `twiiIndexHistory` (`/indicesReport/MI_5MINS_HIST`)

- Required (parser): `Date`, `ClosingIndex`
- Canonical field candidates:
  - close: `ClosingIndex`
  - open: `OpeningIndex`
  - high: `HighestIndex`
  - low: `LowestIndex`
  - volume: `TradeVolume`
  - turnover: `TradeValue`
  - normalization output:
    - `tradeDate: parseTwseOpenApiTradeDate(Date)`
    - `close: parseTwseOpenApiNumericCell(ClosingIndex)`

### 2) `listedStockDailyClose` (`/exchangeReport/STOCK_DAY_AVG_ALL`)

- Required (parser): `Date`, `Code`, `ClosingPrice`
- Canonical field candidates:
  - close: `ClosingPrice`
  - open/high/low: nullable through parser contract (currently optional fallback)
  - date parse path identical to other routes

### 3) `listedStockDailyTradingInfo` (`/exchangeReport/STOCK_DAY_ALL`)

- Required (parser): `Date`, `Code`, `OpeningPrice`, `HighestPrice`, `LowestPrice`, `ClosingPrice`
- Canonical field candidates:
  - open: `OpeningPrice`
  - high: `HighestPrice`
  - low: `LowestPrice`
  - close: `ClosingPrice`
  - volume/turnover: optional if provided (`TradeVolume`/`TradeValue`)

### 4) `marketDailyStatistics` (`/exchangeReport/MI_INDEX`)

- Required (parser): `Date`, `IndexName`, `ClosingIndex`
- Canonical field candidates:
  - close: `ClosingIndex`
  - open/high/low/volume/turnover: optional in parser fallback

## Parser/normalization contract

- Date acceptance:
  - ROC-style `YYY/MM/DD` (2-3 digit ROC year)
  - compact `YYYYMMDD`
  - ISO `YYYY-MM-DD`
- Numeric parsing:
  - accepts `string` or `number`
  - strips comma separators
  - `"-"` / empty becomes `null`

## Failure class mapping to handoff

- `none` → handoff ready if sorted points count > 0
- `no_rows` / `not_object` / `missing_required_field` / `field_mismatch` / `duplicate_dates` / `schema_drift_blocked` → handoff blocked
- duplicate-date check is computed before runtime handoff; duplicates prevent ready status in current adapter.

## Roadmap: field-contract escalation

1. Lock parser-required fields in synthetic fixture set (done in current lane).
2. Confirm field name variants for each route (e.g., `ClosingIndex` vs `ClosingPrice`) by bounded metadata evidence.
3. Add explicit synthetic fixture row sets for:
   - `tradeDate` malformed forms
   - missing optional fields
   - duplicate dates
   - number format commas and dash markers
4. When synthetic fixtures are stable and no-fault, PM can approve next real ingestion runtime contract extension.

## Downgrade rule (hard boundaries)

- Missing/invalid close is not recoverable in this lane and must remain blocked.
- Missing optional fields can remain null; warnings should be preserved and surfaced in runtime warning union.
- Any parser failure class remains "blocked no points exported"; this is expected by the no-write synthetic case-note lane.
