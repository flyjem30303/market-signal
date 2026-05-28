# CP3 Taiwan Stock Endpoint Contract Matrix

Status: contract matrix drafted

Date: 2026-05-29

Purpose:

- Convert CP3 historical source research into endpoint-level contracts.
- Define what each source candidate may provide before any probe or ingestion.
- Keep endpoint probing metadata-only until legal and CEO approval.

## CEO Decision

```text
REVISE
```

Endpoint contracts may be documented and probed for metadata. Historical
ingestion, Supabase writes, public backtest claims, and `scoreSource=real`
remain unapproved.

## Contract Rules

```text
metadata probe only
no historical data download committed
no Supabase writes
no scoreSource=real
no public backtest claims
license / terms reviewed by D before ingestion
endpoint contract reviewed by A before ingestion
field mapping reviewed by A and C before ingestion
rate-limit / fair-use policy required before automation
CEO approval required before ingestion
```

## Matrix

| ID | Source | Endpoint / Page | Candidate Use | Market Scope | Inputs To Confirm | Expected Fields | Contract Status | Main Blocker |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TWSE-PRICE-DAILY-ALL | TWSE OpenAPI / data.gov.tw | `exchangeReport/STOCK_DAY_ALL` / `https://data.gov.tw/dataset/11549` | Daily OHLCV snapshot candidate | TWSE listed securities; common-stock filtering required | Current-data endpoint behavior, whether historical date parameter exists, CSV/API URL contract | date, symbol, name, volume, value, open, high, low, close, change, transaction_count | candidate_requires_probe | Historical range and automation terms not confirmed |
| TWSE-PRICE-AVG-ALL | TWSE OpenAPI / data.gov.tw | `exchangeReport/STOCK_DAY_AVG_ALL` / `https://data.gov.tw/en/datasets/11548` | Daily close and monthly average candidate | TWSE listed securities; common-stock filtering required | Current-data endpoint behavior, whether historical date parameter exists, monthly average semantics | date, symbol, name, close, monthly_average | candidate_requires_probe | Not enough OHLCV fields for full price model |
| TWSE-VALUATION-DATE | TWSE OpenAPI / data.gov.tw | `exchangeReport/BWIBBU_d` / `https://data.gov.tw/en/datasets/11547` | Daily valuation candidate | TWSE listed securities | Date parameter contract, symbol filtering, unavailable values | date, symbol, dividend_yield, pe_ratio, pb_ratio | candidate_requires_probe | Valuation history and missing-value handling not confirmed |
| TWSE-HISTORICAL-PAGE | TWSE public historical page | `https://www.twse.com.tw/zh/trading/historical/stock-day.html` | Human-verifiable historical fallback | TWSE listed securities by symbol | Date format, stock code parameter, CSV export terms, history start date | date, symbol, volume, value, open, high, low, close, change, transaction_count | legal_review_required | Public page export automation not approved |
| TPEX-PRICE-DAILY | TPEx OpenAPI | `tpex_mainboard_daily_close_quotes` / `https://www.tpex.org.tw/openapi/` | Daily quote candidate | TPEx mainboard common stocks | Exact path, date parameter, common-stock filter, history range | date, symbol, name, close, change, volume, value, open, high, low if available | candidate_requires_probe | Exact historical support and terms not confirmed |
| TPEX-VALUATION | TPEx OpenAPI | `tpex_mainboard_peratio_analysis` / `https://www.tpex.org.tw/openapi/` | Valuation candidate | TPEx mainboard common stocks | Exact path, date parameter, field nullability | date, symbol, pe_ratio, dividend_yield, pb_ratio | candidate_requires_probe | History range and derived-score rights not confirmed |
| TPEX-HISTORICAL-PAGE | TPEx public historical page | `https://www.tpex.org.tw/en-us/mainboard/trading/info/pricing_hist96.html` | Human-verifiable historical fallback | TPEx mainboard stocks | Date format, export behavior, current vs historical page routing | date, symbol, quote fields, volume/value fields | legal_review_required | Public page export automation not approved |
| TPEX-ESHOP-EOD | TPEx E-Data Shop | `https://eshop.tpex.org.tw/en/product/detail/2c92e01394fcf4c7019518bffe06000c` | Contracted end-of-day data path | Subscribed TPEx products | Subscription terms, auth, delivery format, historical range, redistribution rights | package-defined | contract_review_required | Member subscription terms and derived-score rights not reviewed |

## Probe Design

Allowed next probe:

```text
request endpoint metadata only
record HTTP status, content type, schema keys, and sample row count
discard response body after extracting metadata
write only docs/reviews metadata report
do not write data files
do not write Supabase
```

Not allowed:

```text
bulk crawl dates
loop across symbols
commit CSV / JSON market data
populate daily_prices / daily_fundamentals
use probe output for model scoring
```

## Minimum Acceptance Before Source-Depth Smoke

```text
TWSE listed price endpoint contract selected
TWSE listed valuation endpoint contract selected or marked unavailable
TPEx price endpoint contract selected or deferred with CEO approval
TPEx valuation endpoint contract selected or deferred with CEO approval
license / terms reviewed by D
rate-limit / fair-use policy documented
field mapping documented by A and C
corporate-action handling documented
inactive / delisted symbol handling documented
```

## Role Review

A / PM+Dev:

```text
The matrix is enough to start metadata-only probes. It is not enough to start
historical ingestion.
```

B / Marketing:

```text
No public claim should mention complete historical coverage yet. Future copy can
say the team is evaluating official sources only after release approval.
```

C / Investment:

```text
TWSE and TPEx daily prices are necessary but not sufficient. Valuation fields,
corporate actions, and inactive-symbol survivorship bias remain model blockers.
```

D / Legal:

```text
Government open-data references are promising, but production storage,
automation, redistribution, and derived-score rights must be reviewed source by
source.
```

E / CEO:

```text
Proceed to metadata-only endpoint probe. Do not ingest. Prefer TWSE listed-stock
path first; TPEx can follow after the TWSE contract is stable.
```

F / Design:

```text
No product UI change. Future evidence should be summarized as source coverage
and confidence, not endpoint names.
```

## Next Engineering Slice

```text
build metadata-only endpoint probe plan
run no bulk downloads
record docs/reviews report only
```

