# CP3 Taiwan Stock Legal And Field Contract Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: Endpoint metadata probe completed

## CEO Decision

```text
REVISE
```

The metadata probe proves that candidate TWSE / TPEx endpoints are reachable.
It does not approve historical ingestion, production storage, derived public
scores, source-depth smoke, or public backtest claims.

## Source References

```text
Government Open Data License
https://data.gov.tw/license

Government Open Data Platform license summary
https://data.gov.tw/en/licenses

Government Open Data Platform FAQ on use scope
https://data.gov.tw/en/faqs/903

TWSE daily trading dataset
https://data.gov.tw/dataset/11549

TWSE daily closing price and monthly average dataset
https://data.gov.tw/en/datasets/11548

TWSE valuation dataset
https://data.gov.tw/en/datasets/11547

TPEx OpenAPI
https://www.tpex.org.tw/openapi/

TPEx End-of-Day API contract path
https://eshop.tpex.org.tw/en/product/detail/2c92e01394fcf4c7019518bffe06000c
```

## D / Legal Review

Current legal status:

```text
not approved for ingestion
not approved for automated historical collection
not approved for public raw redistribution
not approved for scoreSource=real
not approved for public backtest claims
```

TWSE open-data path:

```text
promising but not final
data.gov.tw references Open Government Data License 1.0
need confirm each TWSE dataset license metadata
need confirm attribution requirements
need confirm automation and rate-limit expectations
need confirm whether derived public scores are allowed
need confirm whether storing normalized copies is allowed
```

TPEx OpenAPI path:

```text
candidate only
need confirm API terms and automation rules
need confirm historical date access terms
need confirm derived-score and public-display rights
need confirm whether raw-field redistribution is restricted
```

TPEx e-shop contract path:

```text
contract review required
need review member subscription terms
need confirm external-use pricing / free-use scope
need confirm historical subscription coverage
need confirm authentication and delivery obligations
need confirm derived-score rights in writing
```

## A / PM+Dev Field Contract Review

Current field status:

```text
metadata mapped, contract not approved
```

Candidate normalized `daily_prices` fields:

```text
source_id
exchange_code
symbol
trade_date
open_price
high_price
low_price
close_price
price_change
volume
trade_value
transaction_count
raw_currency
raw_unit
quality_flags
source_fetched_at
```

Candidate normalized `daily_fundamentals` fields:

```text
source_id
exchange_code
symbol
trade_date
close_price
dividend_yield
dividend_year
pe_ratio
pb_ratio
fiscal_year_quarter
quality_flags
source_fetched_at
```

TWSE mapped metadata:

```text
Date -> trade_date
Code -> symbol
Name -> source_name
TradeVolume -> volume
TradeValue -> trade_value
OpeningPrice -> open_price
HighestPrice -> high_price
LowestPrice -> low_price
ClosingPrice -> close_price
Change -> price_change
Transaction -> transaction_count
DividendYield -> dividend_yield
DividendYear -> dividend_year
PEratio -> pe_ratio
PBratio -> pb_ratio
FiscalYearQuarter -> fiscal_year_quarter
```

TPEx mapped metadata:

```text
Date -> trade_date
SecuritiesCompanyCode -> symbol
CompanyName -> source_name
Open -> open_price
High -> high_price
Low -> low_price
Close -> close_price
Change -> price_change
TradingShares -> volume
TransactionAmount -> trade_value
TransactionNumber -> transaction_count
PriceEarningRatio -> pe_ratio
DividendPerShare -> dividend_per_share
YieldRatio -> dividend_yield
PriceBookRatio -> pb_ratio
```

## C / Investment Review

Model-readiness blockers:

```text
historical date parameter not confirmed
corporate-action adjustment policy not documented
inactive / delisted symbol handling not documented
survivorship-bias policy not documented
ETF exclusion filter not documented for probes
common-stock filter not documented
valuation missing-value policy not documented
price limit / suspended trading handling not documented
```

Minimum model interpretation policy:

```text
daily_prices alone cannot support CP3 public scoring
valuation fields can support only limited valuation modules
missing fundamentals must lower confidence, not be imputed silently
unadjusted prices cannot be used for return backtests without disclosure
```

## Required Adjustments

```text
create license / terms checklist per endpoint
create field mapping contract per normalized table
create historical parameter probe plan
create corporate-action handling plan
create inactive / delisted symbol policy
create common-stock / ETF exclusion policy
keep CP3 source-depth gate not_ready
```

## Next Implementation Slice

```text
draft historical parameter probe plan
probe one TWSE listed-stock endpoint for parameter metadata only
do not bulk crawl
do not write Supabase
do not commit downloaded market data
```

Historical parameter probe plan:

```text
docs/CP3_TW_STOCK_HISTORICAL_PARAMETER_PROBE_PLAN_2026-05-29.md
```
