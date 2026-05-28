# CP3 Taiwan Stock Historical Data Plan

Status: not approved

Purpose:

- Define the source plan required before CP3 Taiwan stock backtesting.
- Separate historical-data research from approved ingestion.
- Prevent latest-row dry-run data from becoming accidental backtest data.

## CEO Decision

```text
REVISE
```

The project needs historical data, but no historical ingestion is approved yet.

## Required Historical Coverage

Minimum target before backtest implementation:

```text
daily_prices: at least 756 trading dates
daily_fundamentals: at least 252 trading dates
start_date: 2020-01-01 or earlier
market_scope: TW common stocks only
ETF: excluded
public_eligible: false until CP3 approval
```

## Candidate Source Paths

### Path A: Official Historical Endpoints

Status:

```text
research_required
```

Goal:

```text
find official TWSE / TPEx historical price and valuation endpoints
confirm date parameters and symbol coverage
confirm rate limits and automation terms
confirm redistribution / storage permission
```

Risks:

```text
official pages may be daily snapshots only
historical query endpoints may differ by market
terms may block automated bulk collection
valuation history may not be complete
```

### Path B: Contracted / Licensed Data

Status:

```text
research_required
```

Goal:

```text
identify data vendor or exchange contract path
confirm storage, backtest, derived-score, and public-display rights
confirm cost and update cadence
```

Risks:

```text
cost may exceed MVP needs
license may block redistribution
derived score rights may need explicit language
```

### Path C: Internal Research Import

Status:

```text
not_approved
```

Goal:

```text
allow an ignored local research dataset only after source permission is reviewed
run internal backtest prototype without writing Supabase production tables
```

Required constraints:

```text
ignored local file only
no public fixtures
no seed files
no Supabase daily_scores writes
no scoreSource=real
no public claims
```

## Required Approval Before Ingestion

```text
source URL / provider documented
license / terms reviewed by D
field contract documented by A
historical depth smoke report passes
corporate-action handling documented
inactive / delisted symbol handling documented
CP3 source-depth gate ready
CEO approval recorded
```

## Next Engineering Slice

```text
research official historical TWSE / TPEx source options
document candidate endpoints and terms
do not ingest yet
```

## Not Allowed

```text
scrape historical pages without legal review
commit downloaded historical datasets
write unapproved historical data into Supabase
use historical dry-runs in public UI
claim backtest validity
```
