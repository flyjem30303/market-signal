# CP3 Taiwan Stock Historical Parameter Probe

Status: parameter metadata probe recorded

Generated at: 2026-05-28T18:50:31.793Z

## CEO Decision

```text
REVISE
```

This report records parameter metadata only. It is not historical ingestion, not
a source-depth pass, not a backtest, and not approval for public scoring.

## Guardrails

```text
metadata-only parameter probe
one endpoint family tested
tested endpoint family: TWSE-PRICE-DATE-PARAM
tested parameter names: date, response_json_date, queryDate
tested dates: 20260527, 20260526, 20200102
no raw market rows stored
no CSV / JSON data files written
no Supabase writes
no scoreSource=real
no public backtest claims
response bodies discarded after metadata extraction
source-depth smoke remains not_ready
Keep public data source mock
```

## Probe Results

| Endpoint Family | Parameter Name | Tested Date | HTTP | Content Type | Row Count | Body Bytes Read Then Discarded | Observed Date Values Only As Metadata | Schema Keys | Error |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TWSE-PRICE-DATE-PARAM | date | 20260527 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | response_json_date | 20260527 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | queryDate | 20260527 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | date | 20260526 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | response_json_date | 20260526 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | queryDate | 20260526 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | date | 20200102 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | response_json_date | 20200102 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |
| TWSE-PRICE-DATE-PARAM | queryDate | 20200102 | 200 | application/json | 1361 | 316394 | 1150527 | Date, Code, Name, TradeVolume, TradeValue, OpeningPrice, HighestPrice, LowestPrice, ClosingPrice, Change, Transaction |  |

## Observed Date Summary

```text
date 20260527: 1150527
response_json_date 20260527: 1150527
queryDate 20260527: 1150527
date 20260526: 1150527
response_json_date 20260526: 1150527
queryDate 20260526: 1150527
date 20200102: 1150527
response_json_date 20200102: 1150527
queryDate 20200102: 1150527
```

## Interpretation

```text
HTTP 200 confirms endpoint reachability for each parameter variant.
Matching observed dates would suggest the parameter may control history.
Repeated current dates across all tested dates would suggest the endpoint may ignore the parameter.
This probe does not prove historical depth, legal permission, common-stock coverage, or model readiness.
```

## Remaining Blockers

```text
license / terms reviewed by D
rate-limit / fair-use policy documented
confirmed historical date parameter selected
field mapping reviewed by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
source-depth smoke still not_ready until approved data exists
```
