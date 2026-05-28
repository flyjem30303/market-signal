# ETF Schema

Status: internal planning

ETF support uses separate tables so ETF diagnostics are not forced into common
stock PE/PB fundamentals.

## Tables

```text
etf_profiles
etf_daily_metrics
etf_holdings
```

## etf_profiles

Stable ETF metadata.

| column | type | note |
|---|---|---|
| stock_id | uuid | references stocks.id |
| fund_category | text | fund category |
| tracking_index | text | tracked benchmark |
| issuer | text | issuer / sponsor |
| expense_ratio | numeric | annual expense ratio |
| distribution_frequency | text | distribution cadence |
| source_name | text | data source |
| source_url | text | source URL |
| updated_at | timestamp | update time |

## etf_daily_metrics

Date-based ETF metrics.

| column | type | note |
|---|---|---|
| stock_id | uuid | references stocks.id |
| trade_date | date | metric date |
| nav | numeric | net asset value |
| premium_discount | numeric | premium / discount to NAV |
| aum | numeric | assets under management |
| tracking_difference | numeric | tracking difference |
| constituent_count | integer | holdings count |
| last_distribution | numeric | latest distribution amount |
| source_name | text | data source |
| source_url | text | source URL |

## etf_holdings

ETF holdings snapshots.

| column | type | note |
|---|---|---|
| stock_id | uuid | references stocks.id |
| holding_symbol | text | holding symbol |
| holding_name | text | holding name |
| holding_country | text | holding country |
| holding_exchange | text | holding exchange |
| weight | numeric | holding weight |
| as_of_date | date | holdings snapshot date |
| source_name | text | data source |
| source_url | text | source URL |

## Current Boundary

The schema is preparation only. No ETF-specific source, scoring, public
interpretation, or marketing claim is approved yet.
