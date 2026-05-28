# ETF MIS NAV Disclosure Research

Date: 2026-05-29

Status: research only

This note records research on the TWSE Market Information System (MIS) ETF
issued-units and real-time NAV disclosure surface. It does not approve
ingestion, redistribution, scoring, or public display.

## Legacy Page

Historical public references point to:

```text
https://mis.twse.com.tw/stock/etf_nav.jsp?ex=tse
https://mis.twse.com.tw/stock/etf_nav.jsp?ex=otc
```

Observed on 2026-05-29:

```text
The legacy JSP URLs return an HTML page that redirects to the MIS homepage.
They are no longer a reliable direct data entry point.
```

## Current MIS App Surface

Current MIS app entry:

```text
https://mis.twse.com.tw/stock/
```

Observed frontend modules:

```text
TseEtf
OtcEtf
IndicatorDisclosureEtf
valueDisclosureEtf
```

Observed data calls from the current MIS frontend:

```text
https://mis.twse.com.tw/stock/data/all_etf.txt
https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=otc&i=B0&lang=zh_tw
```

## Sample Response Evidence

The `all_etf.txt` response contains issuer-grouped ETF NAV disclosure data:

```text
msgArray
refURL
userDelay
rtMessage
rtCode
```

Observed ETF row fields:

```text
a: ETF code
b: ETF name
c: issued beneficial units
d: change in issued units versus prior day
e: trading price
f: estimated NAV
g: estimated premium / discount
h: previous business day NAV
i: data date
j: data time
k: underlying index / product type bucket
```

Observed category response fields:

```text
ex
ch
nf
key
n
bp
size
rtcode
rtmessage
exKey
cachedAlive
```

## Current Interpretation

Current conclusion:

```text
TWSE MIS has a current public data surface for ETF NAV / premium-discount
disclosure.
```

This improves the technical feasibility of a Taiwan ETF data adapter, but it
does not approve ingestion.

## Remaining Blockers

```text
terms / license / redistribution review
rate-limit and fair-use review
cache and update behavior review
historical date parameter behavior
field stability over multiple trading days
TSE vs OTC classification mapping
handling issuer-specific refURL and malformed payload variants
missing expense_ratio / tracking_difference / constituent_count / top_holdings
```

## CEO Current Decision

```text
REVISE
```

Continue endpoint due diligence. Do not build ingestion until CP1 explicitly
approves source usage and operational constraints.

Follow-up validation plan:

```text
docs/ETF_MIS_VALIDATION_PLAN_2026-05-29.md
```
