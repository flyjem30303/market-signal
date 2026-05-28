# ETF MIS Validation Plan

Date: 2026-05-29

Status: non-ingesting validation plan

This plan defines the checks required before the project can design a Taiwan
ETF MIS adapter. It does not approve ingestion, redistribution, scoring, or
public display.

## Candidate Surfaces

```text
https://mis.twse.com.tw/stock/data/all_etf.txt
https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=otc&i=B0&lang=zh_tw
```

## Validation Checks

Required before adapter design:

```text
endpoint availability
field contract
update and cache behavior
date parameter behavior
rate-limit / fair-use rule
```

Required before ingestion:

```text
license / redistribution approval
```

Already approved:

```text
non-ingesting validation guard
```

## Smoke Test Shape

The future smoke test should:

```text
GET candidate endpoints with a browser-like User-Agent
verify HTTP 200
parse JSON
verify rtCode / rtMessage variants
verify all_etf.txt has a1 issuer groups
verify ETF rows contain a, b, c, d, e, f, g, h, i, j, k
verify refURL and userDelay are captured as metadata
verify getCategory.jsp returns msgArray and size
emit a report only
never write Supabase, seed data, or product fixtures
```

## Required Output

```text
status
checked_at
endpoint statuses
field missing report
sample dates and times
cache / update observation
legal blockers
adapter readiness decision
```

## CEO Current Decision

```text
REVISE
```

The technical surface is promising, but ETF MIS remains blocked until this plan
has evidence and CP1 approves the source constraints.
