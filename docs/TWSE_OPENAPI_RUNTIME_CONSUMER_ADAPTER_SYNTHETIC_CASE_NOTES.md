# TWSE OpenAPI Runtime Consumer Adapter Synthetic Case Notes

?遢?辣?舀 A1 ??`twse_openapi_parser_contract_consumer_adapter_no_fetch` 敺?鞈??祕???葉??case-note 鈭支???
## Scope

- 瑼?: `src/lib/twse-openapi-parser-consumer-adapter.ts`
- ??:
  - `fixturePolicy = "synthetic_parser_result_only"`
  - `publicDataSource = "mock"`
  - `scoreSource = "mock"`
  - `rawMarketDataFetch = false`
  - `sqlExecution = false`
  - `supabaseWrite = false`
  - no endpoint fetch in this lane

## Failure and Output Matrix

| Case | Parser failure class | Parser state | Runtime handoff expectation | Expected status | Warnings |
| --- | --- | --- | --- | --- | --- |
| Success parse | `none` | records parsed and sorted by `tradeDate` | points emitted with ordered `tradeDate` and change metrics | `ready` | aggregated from normalized warnings |
| Parser returns `none` | `none` | all required fields validated | ready path stays on mock handoff boundary | `ready` | no failure-specific warning |
| No rows | `no_rows` | parser input has 0 rows | `runtime_handoff_fail_closed_no_points_exported` | `blocked` | `parser_result_failure_class:no_rows` |
| Row not object | `not_object` | non-object items skipped | no points exported | `blocked` | `parser_result_failure_class:not_object` |
| Missing required field | `missing_required_field` | one or more required field missing | no points exported | `blocked` | `parser_result_failure_class:missing_required_field` |
| Required field parse failure | `field_mismatch` | date parse or close parse fail | no points exported | `blocked` | `parser_result_failure_class:field_mismatch` |
| Duplicate trade date | `duplicate_dates` | duplicate normalized `tradeDate` observed | no points exported | `blocked` | `parser_result_failure_class:duplicate_dates` |
| Schema drift / contract mismatch | `schema_drift_blocked` | row/field drift from adapter contract | no points exported | `blocked` | `parserResult.failureClass` mapped to fail-closed |

## Route coverage expectations from parser result

- `twiiIndexHistory`
  - success needs `Date` and `ClosingIndex` at minimum
  - `sourceRouteId` must preserve `twiiIndexHistory`
- `listedStockDailyClose`
  - success needs `Date`, `Code`, `ClosingPrice`
  - non-required fields may become `null` warnings
- `listedStockDailyTradingInfo`
  - success needs `Date`, `Code`, `OpeningPrice`, `HighestPrice`, `LowestPrice`, `ClosingPrice`
- `marketDailyStatistics`
  - success needs `Date`, `IndexName`, `ClosingIndex`

## Runtime output schema expectations for A1 review

- `buildTwseOpenApiRuntimeHandoff` only returns `status=ready` when `failureClass === "none"` and parser points are not empty.
- Any failure class not equal to `none` must map to:
  - `status: "blocked"`
  - `pointCount: 0`
  - `points: []`
  - fixed `runtimeChange: { change: null, changePercent: null }`
  - warning includes `runtime_handoff_fail_closed_no_points_exported`
- Parser-empty success state (records 0 after normalization) must map to blocked output with warning `parser_result_empty_after_normalization`.

- Failure class matrix quick map for check consistency:
  - `failureClass: none` => `status: "ready"`
  - `failureClass: not_object` => `status: "blocked"`
  - `failureClass: missing_required_field` => `status: "blocked"`
  - `failureClass: field_mismatch` => `status: "blocked"`
  - `failureClass: duplicate_dates` => `status: "blocked"`
  - `failureClass: schema_drift_blocked` => `status: "blocked"`
  - all non-`none` failure classes map to `runtime_handoff_fail_closed_no_points_exported` and warning families above.

- hard boundaries: this lane remains synthetic only, no endpoint fetch, no raw row export, and no write path.

## Readiness effect on data-realification

- A1 should treat this handoff as `synthetic_parser_result_only` evidence only.
- No route in this slice is allowed to authorise real fetch, SQL, or Supabase write.
- The consumer adapter case notes become ready-to-wire when `status` is `ready` and the parser contract checker is clean under synthetic fixtures.
