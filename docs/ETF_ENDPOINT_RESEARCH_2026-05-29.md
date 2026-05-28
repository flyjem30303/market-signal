# ETF Endpoint Research

Date: 2026-05-29

Status: research only

This note records endpoint-level evidence for ETF source due diligence. It does
not approve ingestion, redistribution, scoring, or public display.

## TWSE Daily ETF Trading Page

Official page:

```text
https://www.twse.com.tw/en/page/ETF/daily.html
```

Observed:

```text
date query
print / HTML
download CSV
data available since 2017/01/01
```

Useful for:

```text
daily trading data
historical ETF trading reference
```

Open questions:

```text
stable machine-readable endpoint
field mapping to daily_prices vs ETF-specific tables
license and redistribution terms
```

## TWSE ETFortune Detail Pages

Official example:

```text
https://www.twse.com.tw/en/ETFortune-institute/etfInfo/009804
```

Observed fields across ETFortune detail pages:

```text
ETF name
asset class
issuer
benchmark
AUM
investor count
daily close price chart
trading value chart
trading volume chart
monthly AUM
distribution
NAV and premium / discount
```

Useful for:

```text
fund profile research
NAV / premium discount evidence
distribution evidence
```

Open questions:

```text
whether chart data has stable JSON endpoints
whether data may be stored and displayed in product
whether holdings / constituent count are available from TWSE or issuer sources
```

## TWSE ETF JSON Disclosure Format

Official PDF:

```text
https://dsp.twse.com.tw/public/static/downloads/tradingDepartment/ETF%20%E7%94%B3%E8%B4%96%E8%B3%87%E8%A8%8A%E5%8F%8A%E5%8D%B3%E6%99%82%E6%B7%A8%E5%80%BC%E6%8F%AD%E9%9C%B2%E5%B0%88%E5%8D%80%E4%BB%8B%E6%8E%A5%E6%A0%BC%E5%BC%8F%E8%AA%AA%E6%98%8E_20250109142554.pdf
```

Important evidence:

```text
issuer provides fixed http / https URL
payload format is JSON
UTF-8 encoding
no null / undefined values
rtCode 0000 means normal
rtMessage OK means normal
```

Useful fields:

```text
ETF code
ETF name
issued beneficial units
change in units versus prior day
trading price
estimated NAV
estimated premium / discount
previous business day NAV
data date
data time
underlying index / product type
issuer reference URL
update interval
```

Potential mapping:

```text
ETF code -> stocks.symbol
ETF name -> stocks.name / etf_profiles
trading price -> daily_prices.close or intraday diagnostic only
estimated NAV -> etf_daily_metrics.nav
estimated premium / discount -> etf_daily_metrics.premium_discount
previous business day NAV -> etf_daily_metrics.nav validation reference
data date / time -> data_runs / freshness
underlying index / product type -> etf_profiles.fund_category
```

Remaining blockers:

```text
discover issuer fixed JSON URLs
confirm if TWSE has an index of issuer URLs
confirm license / redistribution permission
confirm storage and public display terms
fill expense_ratio / tracking_difference / constituent_count / top_holdings gaps
```

Follow-up discovery note:

```text
docs/ETF_JSON_URL_DISCOVERY_2026-05-29.md
```

## CEO Current Decision

```text
REVISE
```

Endpoint evidence is promising enough to continue research. ETF ingestion
remains blocked.
