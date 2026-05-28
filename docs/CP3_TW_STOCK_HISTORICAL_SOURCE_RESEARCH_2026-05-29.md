# CP3 Taiwan Stock Historical Source Research

Status: research recorded

Date: 2026-05-29

Purpose:

- Record candidate historical data sources before CP3 Taiwan stock backtesting.
- Keep source research separate from ingestion approval.
- Identify legal and data-contract blockers before any historical import.

## CEO Decision

```text
REVISE
```

The project may continue source research and internal gate design. Historical
ingestion remains unapproved.

## Source Candidates

### TWSE Official Open Data

Status:

```text
candidate_requires_legal_review
```

Observed official references:

```text
TWSE individual daily trading dataset
https://data.gov.tw/dataset/11549

TWSE individual daily closing price and monthly average dataset
https://data.gov.tw/en/datasets/11548

TWSE individual valuation dataset by code
https://data.gov.tw/en/datasets/11547

TWSE historical stock day page
https://www.twse.com.tw/zh/trading/historical/stock-day.html
```

Current source reading:

```text
data.gov.tw lists TWSE stock daily trading, closing price, and valuation
datasets as free primary data under Open Government Data License 1.0.
TWSE historical stock-day page states availability from 2010-01-04.
```

Potential fit:

```text
daily_prices: likely candidate
daily_fundamentals: valuation candidate only, not full fundamentals
market_scope: listed TWSE stocks
historical_depth: likely enough for 2020-01-01 target if access terms allow
```

Blockers before ingestion:

```text
confirm official API or CSV query URL contract
confirm automation and rate-limit terms
confirm storage and derived-score use under license
confirm corporate-action interpretation
confirm inactive / delisted symbol coverage
confirm field names and date formats
```

### TPEx Official Public / OpenAPI Sources

Status:

```text
candidate_requires_legal_review
```

Observed official references:

```text
TPEx OpenAPI
https://www.tpex.org.tw/openapi/

TPEx daily stock quotes page
https://www.tpex.org.tw/en-us/mainboard/trading/info/pricing_hist96.html
```

Current source reading:

```text
TPEx public pages expose historical daily quote navigation, including
post-2007 references. TPEx OpenAPI describes official market data APIs.
```

Potential fit:

```text
daily_prices: possible candidate for TPEx common stocks
daily_fundamentals: not confirmed
market_scope: TPEx mainboard stocks, if API and terms allow
historical_depth: likely enough for 2020-01-01 target, not yet contract-verified
```

Blockers before ingestion:

```text
confirm exact OpenAPI endpoint paths for historical daily stock quotes
confirm API parameter contract and history range
confirm whether public page export is allowed for automated collection
confirm storage and derived-score use
confirm inactive / delisted symbol coverage
```

### TPEx E-Data Shop / Contract Path

Status:

```text
contract_path_candidate
```

Observed official references:

```text
TPEx End-of-Day API document
https://eshop.tpex.org.tw/en/product/detail/2c92e01394fcf4c7019518bffe06000c

TPEx 盤後資料 API 說明
https://eshop.tpex.org.tw/zh/product/detail/2c92e01394fcf4c7019518bbf65f000a
```

Current source reading:

```text
TPEx E-Data Shop lists End-of-Day API data with daily period, external-use
pricing, member subscription terms, and historical data subscription for
previous-month-and-earlier data.
```

Potential fit:

```text
daily_prices: strong candidate if subscription terms fit
daily_fundamentals: not confirmed
market_scope: TPEx products included in subscribed package
historical_depth: explicit historical subscription path
```

Blockers before ingestion:

```text
review member subscription terms
confirm free external-use scope
confirm whether derived public scores are allowed
confirm whether redistribution of raw fields is restricted
confirm operational access and authentication requirements
```

## Role Review

A / PM+Dev:

```text
Do not implement historical ingestion yet. Next engineering work should be a
source-contract matrix and endpoint probe that records metadata only.
```

B / Marketing:

```text
This supports future credibility copy, but no user-facing claim should mention
backtesting until the source-depth gate passes.
```

C / Investment:

```text
Daily prices alone are insufficient for a credible CP3 score. Valuation,
liquidity, corporate actions, and inactive-symbol handling must be explicit.
```

D / Legal:

```text
TWSE Open Government Data License references look promising, but automation,
storage, derived-score display, and redistribution must be reviewed before
production use. TPEx e-shop terms must be reviewed separately.
```

E / CEO:

```text
Continue research. Do not ingest. Prefer TWSE open-data path for listed stocks
first, then TPEx only after terms and endpoint contracts are clear.
```

F / Design:

```text
No UI change yet. When source depth becomes ready, expose evidence as freshness,
coverage, and confidence rather than raw source complexity.
```

## Current Recommendation

```text
Path A TWSE official open data: best first research path
Path A TPEx official OpenAPI/public pages: second research path
Path B TPEx e-shop contract path: keep as fallback / legal-reviewed option
Path C internal research import: still not approved
```

## Required Before Any Historical Ingestion

```text
source URL / provider documented
license / terms reviewed by D
endpoint contract documented by A
field mapping documented by A and C
historical depth smoke report passes
corporate-action handling documented
inactive / delisted symbol handling documented
rate limit / fair-use policy documented
CEO approval recorded
```

## Not Approved

```text
no historical ingestion
no Supabase writes
no committed downloaded datasets
no public backtest claims
no scoreSource=real
```

Endpoint contract matrix:

```text
docs/CP3_TW_STOCK_ENDPOINT_CONTRACT_MATRIX_2026-05-29.md
```
